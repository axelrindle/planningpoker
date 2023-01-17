import { asClass, asValue, createContainer } from 'awilix'
import config from 'config'
import { Disposable, Initable } from './types.js'
import { cwd } from './util.js'

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

for await (const service of Object.values<Initable>(container.cradle)) {
    if (typeof service.init === 'function') {
        await service.init()
    }
}

export default container
