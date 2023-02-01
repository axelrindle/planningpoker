import { FileStore } from '@tus/file-store'
import { Server } from '@tus/server'
import { AwilixContainer } from 'awilix'
import express, { Router } from 'express'
import { join } from 'node:path'
import { makeLogger } from '../logger.mjs'
import DatabaseService from '../service/database.mjs'
import StorageService from '../service/storage.mjs'

export default async function makeUploader(container: AwilixContainer, subDirectory?: string): Promise<Router> {
    const storage = container.resolve<StorageService>('storage')
    const database = container.resolve<DatabaseService>('database')

    const directory = join('uploads', subDirectory ?? '')
    await storage.mkdir(directory)

    const logger = makeLogger('upload')
    const server = new Server({
        datastore: new FileStore({
            directory: storage.resolve(directory)
        }),
        path: '/',
        async onUploadFinish(_req, res, upload) {
            await database.execute(`
                insert into upload values (
                    null,
                    '${upload.id}',
                    '${upload.metadata?.['filename']}',
                    '${upload.metadata?.['filetype']}',
                    ${upload.size},
                    ${subDirectory ? '\'' + subDirectory + '\'' : null}
                )`
            )
            return res
        },
    })

    const uploadApp = express.Router()
    uploadApp.all('*', async (req, res) => {
        await storage.mkdir(directory)

        const now = Date.now()
        logger.debug('Incoming upload')

        await server.handle(req, res)

        const then = Date.now()
        logger.debug('Upload finished in ' + (then - now) + ' ms')
    })

    return uploadApp
}
