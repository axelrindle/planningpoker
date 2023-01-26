import { Request, Response } from 'express'
import { basename } from 'path'
import DatabaseService from '../../service/database.mjs'
import StorageService from '../../service/storage.mjs'

export default class UploadController {

    private database: DatabaseService
    private storage: StorageService

    constructor(database: DatabaseService, storage: StorageService) {
        this.database = database
        this.storage = storage
    }

    async serve(req: Request, res: Response) {
        const { hash } = req.params
        const info = await this.database.querySingle(`select * from upload where hash = '${hash}'`)

        const file = this.storage.resolve(`uploads/${hash}`)

        res.download(file, info.name ?? basename(file))
    }
}
