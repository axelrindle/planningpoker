import { asClass, createContainer } from 'awilix'
import { Disposable, Initable } from './types.js'
import { cwd } from './util.js'

const container = createContainer({
    injectionMode: 'CLASSIC'
})

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
