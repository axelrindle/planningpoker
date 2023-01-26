import { Request, Response } from 'express'
import DatabaseService from '../../service/database.mjs'

export default class PresetController {

    private database: DatabaseService

    constructor(database: DatabaseService) {
        this.database = database
    }

    async list(_req: Request, res: Response) {
        const presets = await this.database.queryAll('select * from preset')
        for (const preset of presets) {
            const sql = `
            SELECT c.id, c.name
            FROM card_preset cp
            INNER JOIN card c ON cp.card_id = c.id
            WHERE cp.preset_id = ${preset.id}
            `
            const cards = await this.database.queryAll(sql)
            preset.cards = cards
        }
        res.json(presets)
    }
}
