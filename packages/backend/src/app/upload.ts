import { FileStore } from '@tus/file-store'
import { Server } from '@tus/server'
import { AwilixContainer } from 'awilix'
import express, { Router } from 'express'
import { makeLogger } from '../logger.js'
import DatabaseService from '../service/database.js'
import StorageService from '../service/storage.js'

export default function makeUploader(container: AwilixContainer): Router {
    const storage = container.resolve<StorageService>('storage')
    const database = container.resolve<DatabaseService>('database')

    const logger = makeLogger('upload')
    const server = new Server({
        datastore: new FileStore({
            directory: storage.resolve('uploads')
        }),
        path: '/',
        async onUploadFinish(_req, res, upload) {
            await database.execute(`
                insert into upload values (
                    null,
                    '${upload.id}',
                    '${upload.metadata?.['filename']}',
                    '${upload.metadata?.['filetype']}',
                    ${upload.size}
                )`
            )
            return res
        },
    })

    const uploadApp = express.Router()
    uploadApp.all('*', async (req, res) => {
        storage.mkdir('uploads')

        const now = Date.now()
        logger.debug('Incoming upload')

        await server.handle(req, res)

        const then = Date.now()
        logger.debug('Upload finished in ' + (then - now) + ' ms')
    })

    return uploadApp
}
