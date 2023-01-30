import { Request, Response } from 'express'
import { Logger } from 'winston'
import { makeLogger } from '../../logger.mjs'
import DatabaseService from '../../service/database.mjs'
import GameService from '../../service/game.mjs'

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

        res.json(room)
    }

    async create(req: Request, res: Response) {
        const { name, description, limit } = req.body
        const room = { name, description, limit }

        try {
            const sql = `insert into room values (null, '${name}', '${description ?? null}', ${limit ?? null})`
            await this.database.execute(sql)
            await this.game.updateGames()
            res.json(room)
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
