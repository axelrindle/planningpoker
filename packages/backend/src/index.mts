import { createTerminus } from '@godaddy/terminus'
import { readFile } from 'fs/promises'
import PrettyError from 'pretty-error'
import startContainer from './container.mjs'
import { makeLogger } from './logger.mjs'
import { startServer } from './server.mjs'
import { ShutdownFunction } from './types.mjs'

if (! process.env['DISABLE_BANNER']) {
    const banner = await readFile('resources/banner.txt')
    process.stderr.write(banner)
}

const prettyError = new PrettyError()
const logger = makeLogger('main')
logger.info('Initializing...')

process.once('uncaughtException', err => {
    logger.error('Fatal error during initialization!\n\n' + prettyError.render(err))
    process.exit(1)
})

const container = await startContainer()
const [http, websocket] = await startServer(container)

export { container }

export const shutdown: ShutdownFunction = async (customHook?: () => Promise<void>) => {
    process.stdout.write('\n') // insert newline after escape sequence

    logger.info('Shutdown requested...')
    try {
        await new Promise<void>((resolve, reject) => {
            websocket?.close(err => {
                if(err) reject(err)
                else resolve()
            })
        })
        await container.dispose()
        await customHook?.()
        logger.info('Disposed. Goodbye :)')
        // process.exit(0)
    } catch (error) {
        logger.error('Something went horribly wrong!', error)
        // process.exit(1)
    }
}

createTerminus(http, {
    signals: ['SIGINT', 'SIGTERM'],
    onSignal: shutdown
})
