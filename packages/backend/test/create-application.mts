import { randomBytes } from 'node:crypto'
import { join } from 'node:path'
import anyTest, { TestFn } from 'ava'
import getPort from 'get-port'
import rimraf from 'rimraf'
import { cwd } from '../src/util.mjs'
import { ShutdownFunction } from '../src/types.mjs'

interface Context {
    shutdown: ShutdownFunction
}
const test = anyTest as TestFn<Context>

const configDirectory = join(process.cwd(), 'config')
const testConfigDirectory = join(cwd(import.meta.url), 'config')
process.env['NODE_ENV'] = 'test'
process.env['NODE_CONFIG_DIR'] = configDirectory + ':' + testConfigDirectory

const runId = randomBytes(8).toString('hex')
process.env['NODE_TEST_DATA_DIRECTORY'] = `/tmp/planningpoker-test-${runId}`
process.env['NODE_TEST_SERVER_PORT'] = (await getPort()).toString()
process.env['NODE_TEST_SOCKET_PORT'] = (await getPort()).toString()

test.before('start server', async (t) => {
    const { shutdown } = await import('../src/index.mjs')
    t.context.shutdown = shutdown
})

test.after.always(t => t.context.shutdown(() => rimraf(process.env['NODE_TEST_DATA_DIRECTORY'] as string)))

export default test
