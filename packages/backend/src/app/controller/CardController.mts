import { Request, Response } from 'express'
import { join } from 'path'
import { Logger } from 'winston'
import { makeLogger } from '../../logger.mjs'
import DatabaseService from '../../service/database.mjs'
import StorageService from '../../service/storage.mjs'

export default class CardController {

    private logger: Logger
    private database: DatabaseService
    private storage: StorageService

    constructor(database: DatabaseService, storage: StorageService) {
        this.logger = makeLogger('CardController')
        this.database = database
        this.storage = storage
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

            const id = await this.database.querySingle('select id from card where name = ?', [name])
            res.json(id)
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

    async delete(req: Request, res: Response) {
        //@ts-ignore
        const card = req.card
        const upload = await this.database.querySingle('select * from upload where hash = ?', [card.image])

        try {
            if (upload) {
                const uploadPath = join('uploads', upload.sub ?? '', upload.hash)
                this.logger.debug('Deleting upload at ' + uploadPath)
                await this.storage.delete(uploadPath)
                await this.database.execute('delete from upload where id = ' + upload.id)
            }

            await this.database.execute('delete from card where id = ' + card.id)
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
