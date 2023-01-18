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

    async create(req: Request, res: Response) {
        const { name, description, limit } = req.body
        if (!name) {
            return res.status(400).json({
                error: 'No name given!'
            })
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
