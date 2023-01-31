import { Request, Response } from 'express'
import { Logger } from 'winston'
import { makeLogger } from '../../logger.mjs'
import DatabaseService from '../../service/database.mjs'
import GameService from '../../service/game.mjs'
import { hash } from '../../util/hash.mjs'

export default class RoomController {

    private logger: Logger
    private database: DatabaseService
    private game: GameService

    constructor(database: DatabaseService, game: GameService) {
        this.logger = makeLogger('RoomController')
        this.database = database
        this.game = game
    }

    async list(_req: Request, res: Response) {
        const rooms = await this.database.queryAll('select * from room')
        for (const room of rooms) {
            room.users = this.game.getUsers(room)
            room.private = room.password !== null
            delete room.password
        }
        res.json(rooms)
    }

    async read(req: Request, res: Response) {
        const roomId = req.params['roomId']
        const room = await this.database.querySingle('select * from room where id = ' + roomId)

        if (!room) {
            res.status(404).json({
                error: `No room found with ID ${roomId}!`
            })
            return
        }

        room.private = room.password !== undefined
        delete room.password

        res.json(room)
    }

    async create(req: Request, res: Response) {
        const { name, description, limit, password } = req.body

        let passwordEncrypted: string|undefined = undefined
        if (password) {
            passwordEncrypted = await hash(password)
        }

        try {
            await this.database.run('insert into room values (null, $name, $description, $limit, $password)', {
                $name: name,
                $description: description,
                $limit: limit,
                $password: passwordEncrypted
            })
            await this.game.updateGames()
            res.end()
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                error: error.message
            })
        }
    }

    async delete(req: Request, res: Response) {
        const roomId = req.params['roomId']
        const room = await this.database.querySingle('select * from room where id = ' + roomId)

        if (!room) {
            res.status(404).json({
                error: `No room found with ID ${roomId}!`
            })
            return
        }

        try {
            this.game.delete(room)
            await this.database.execute('delete from room where id = ' + roomId)
            res.end()
        } catch (error: any) {
            const message = error.message ?? error ?? 'Unknown error!'
            this.logger.error(message, error)
            res.status(500).json({
                error: message
            })
        }
    }
}
