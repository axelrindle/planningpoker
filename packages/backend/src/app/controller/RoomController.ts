import { Request, Response } from 'express'
import DatabaseService from '../../service/database.js'
import GameService from '../../service/game.js'

export default class RoomController {

    private database: DatabaseService
    private game: GameService

    constructor(database: DatabaseService, game: GameService) {
        this.database = database
        this.game = game
    }

    async list(_req: Request, res: Response) {
        const rooms = await this.database.queryAll('select `id`, `name`, `description`, `limit` from room')
        for (const room of rooms) {
            room.state = this.game.getState(room)
            room.users = this.game.getUsers(room)
        }
        res.json(rooms)
    }

    async create(req: Request, res: Response) {
        const { name, description, limit } = req.body
        if (!name) {
            res.status(400).json({
                error: 'No name given!'
            })
            return
        }

        // TODO: Validation
        const room = { name, description, limit }

        try {
            const sql = `insert into room values (null, '${name}', '${description ?? null}', ${limit ?? null})`
            await this.database.execute(sql)
            res.json(room)
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                error: error.message
            })
        }
    }
}
