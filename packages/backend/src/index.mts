import { createTerminus } from '@godaddy/terminus'
import { readFile } from 'fs/promises'
import startContainer from './container.mjs'
import { startServer } from './server.mjs'

if (! process.env['DISABLE_BANNER']) {
    const banner = await readFile('resources/banner.txt')
    process.stdout.write(banner)
}

const container = await startContainer()
const server = await startServer(container)

createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    onSignal: async () => {
        process.stdout.write('\n') // insert newline after escape sequence
        try {
            await container.dispose()
            console.log('Disposed. Goodbye :)')
            process.exit(0)
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
})
