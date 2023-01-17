import { createTerminus } from '@godaddy/terminus'
import container from './container.js'
import server from './server.js'

server.set('container', container)
const _server = server.listen(3000, () => console.log('Listening on port 3000'))

createTerminus(_server, {
    signals: ['SIGINT', 'SIGTERM'],
    onSignal: async () => {
        process.stdout.write('\n') // insert newline after escape sequence
        await container.dispose()
        console.log('Disposed. Goodbye :)')
    }
})
