import { createTerminus } from '@godaddy/terminus'
import { readFile } from 'fs/promises'
import startContainer from './container.js'
import { startServer } from './server.js'

if (! process.env['DISABLE_BANNER']) {
    const banner = await readFile('resources/banner.txt')
    process.stdout.write(banner)
}

const container = await startContainer()
const server = startServer(container)

createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    onSignal: async () => {
        process.stdout.write('\n') // insert newline after escape sequence
        await container.dispose()
        console.log('Disposed. Goodbye :)')
    }
})
