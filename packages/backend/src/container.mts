import { asClass, asValue, AwilixContainer, createContainer } from 'awilix'
import config from 'config'
import { makeLogger } from './logger.mjs'
import { Service } from './types.mjs'
import { cwd } from './util.mjs'

const logger = makeLogger('container')
const container = createContainer({
    injectionMode: 'CLASSIC'
})

container.register('config', asValue(config))

await container.loadModules(
    [
        'service/*'
    ],
    {
        cwd: cwd(import.meta.url),
        esModules: true,
        formatName: 'camelCase',
        resolverOptions: {
            lifetime: 'SINGLETON',
            register: asClass,
            dispose: async (value: Service) => await value.dispose()
        }
    }
)

export default async function startContainer(): Promise<AwilixContainer> {
    logger.info(`Loaded ${Object.keys(container.cradle).length} services.`)

    let initCount = 0
    const services = Object.entries<Service>(container.cradle)
        .filter(([_k, v]) => typeof v.init === 'function')
        .sort(([_k1, a], [_k2, b]) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    for await (const [key] of services) {
        logger.debug(`Initializing service "${key}"`)
        await container.resolve(key).init()
        initCount++
    }

    logger.info(`Initialized ${initCount} services.`)

    return container
}
