import anyTest, { TestFn } from 'ava'
import getPort from 'get-port'
import { randomBytes } from 'node:crypto'
import rimraf from 'rimraf'
import { ShutdownFunction } from '../src/types.mjs'

interface Context {
    shutdown: ShutdownFunction
    serverPort: number
    socketPort: number
    apiUrl: string
    dataDirectory: string
}
const test = anyTest as TestFn<Context>

test.before('start server', async (t) => {
    process.env['NODE_ENV'] = 'test'

    t.context.serverPort = await getPort()
    t.context.socketPort = await getPort()
    t.context.apiUrl = `http://127.0.0.1:${t.context.serverPort}/api`

    const runId = randomBytes(8).toString('hex')
    t.context.dataDirectory = `/tmp/planningpoker-test-${runId}`

    process.env['PP_DATA_DIRECTORY'] = t.context.dataDirectory
    process.env['PP_SERVER_PORT'] = t.context.serverPort.toString()
    process.env['PP_SERVER_PORT_WEBSOCKET'] = t.context.socketPort.toString()

    const { shutdown } = await import('../src/index.mjs')
    t.context.shutdown = shutdown
})

test.after.always(t => t.context.shutdown(() => rimraf(t.context.dataDirectory)))

export default test
