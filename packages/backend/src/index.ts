import { createTerminus } from '@godaddy/terminus'
import container from './container.js'
import { startServer } from './server.js'

const server = startServer(container)

createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    onSignal: async () => {
        process.stdout.write('\n') // insert newline after escape sequence
        await container.dispose()
        console.log('Disposed. Goodbye :)')
    }
})
