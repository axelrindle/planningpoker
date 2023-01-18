import { asClass, asValue, AwilixContainer, createContainer } from 'awilix'
import config from 'config'
import { makeLogger } from './logger.js'
import { Disposable, Initable } from './types.js'
import { cwd } from './util.js'

const logger = makeLogger('container')
const container = createContainer({
    injectionMode: 'CLASSIC'
})

container.register('config', asValue(config))

container.loadModules(
    [
        'service/*'
    ],
    {
        cwd: cwd(import.meta.url),
        //esModules: true,
        formatName: 'camelCase',
        resolverOptions: {
            lifetime: 'SINGLETON',
            register: asClass,
            dispose: async (value: Disposable) => {
                if (typeof value.dispose === 'function') {
                    await value.dispose()
                }
            }
        }
    }
)

export default async function startContainer(): Promise<AwilixContainer> {
    logger.info(`Loaded ${Object.keys(container.cradle).length} services.`)

    const servicesNeedInit = ['storage']
    for await (const service of servicesNeedInit) {
        logger.debug('Initializing service ' + service + ' ...')
        await container.resolve<Initable>(service).init()
    }

    return container
}
