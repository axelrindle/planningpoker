import { Request, Response } from 'express'
import DatabaseService from '../../service/database.mjs'

export default class CardController {

    private database: DatabaseService

    constructor(database: DatabaseService) {
        this.database = database
    }

    async list(_req: Request, res: Response) {
        const result = await this.database.queryAll('select * from card order by value asc')
        res.json(result)
    }

    async read(req: Request, res: Response) {
        const { id } = req.params

        const card = await this.database.querySingle('select * from card where id = ?', [id])
        if (!card) {
            res.status(404).json({
                error: `No card found with ID ${id}!`
            })
            return
        }

        res.json(card)
    }

    async create(req: Request, res: Response) {
        const { name, value } = req.body

        try {
            await this.database.run('insert into card values (null, $name, $value, null)', {
                $name: name,
                $value: value
            })
            res.end()
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                error: error.message
            })
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params

        const card = await this.database.querySingle('select * from card where id = ?', [id])
        if (!card) {
            res.status(404).json({
                error: `No card found with ID ${id}!`
            })
            return
        }

        const { name, value, image } = req.body

        try {
            const sql = `
                update card
                set name = $name,
                    value = $value,
                    image = $image
                where id = $id
            `
            await this.database.run(sql, {
                $id: id,
                $name: name ?? card.name,
                $value: value ?? card.value,
                $image: image ?? card.image,
            })
            res.end()
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                error: error.message
            })
        }
    }
}
