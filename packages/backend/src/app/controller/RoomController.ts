import { Request, Response } from 'express'
import DatabaseService from '../../service/database.js'

export default class RoomController {

    private database: DatabaseService

    constructor(database: DatabaseService) {
        this.database = database
    }

    async list(req: Request, res: Response) {
        const rooms = await this.database.queryAll('select * from room')
        res.json(rooms)
    }

    create(req: Request, res: Response): any {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({
                error: 'No name given!'
            })
        }

        res.json({ name })
    }
}
