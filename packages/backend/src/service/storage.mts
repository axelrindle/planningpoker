import { IConfig } from 'config'
import { stat } from 'fs/promises'
import mkdirp from 'mkdirp'
import { isAbsolute, join, resolve } from 'path'
import rimraf from 'rimraf'
import { Logger } from 'winston'
import { makeLogger } from '../logger.mjs'
import { Service } from '../types.mjs'

const configKey = 'data_directory'

function getConfigValue(config: IConfig): string | undefined {
    if (config.has(configKey)) {
        return config.get(configKey) as string
    }

    return undefined
}

export function getStorageDirectory(config: IConfig): string {
    const dataDirectory = getConfigValue(config)
    if (!dataDirectory) {
        return join(process.cwd(), 'data')
    }
    else if (!isAbsolute(dataDirectory)) {
        return resolve(process.cwd(), dataDirectory)
    }
    else {
        return resolve(dataDirectory)
    }
}

export default class StorageService extends Service {

    readonly priority = 1
    private directory: string

    private logger: Logger

    constructor(config: IConfig) {
        super()

        this.logger = makeLogger('storage')
        this.directory = getStorageDirectory(config)

        this.logger.debug('Data is at ' + this.directory)
    }

    override async init(): Promise<void> {
        await this.ensureDirectory()
    }

    resolve(...path: string[]): string {
        return join(this.directory, ...path)
    }

    async exists(path: string): Promise<boolean> {
        const abs = this.resolve(path)
        try {
            const stats = await stat(abs)
            console.log(stats)
            return true
        } catch (error) {
            return false
        }
    }

    async mkdir(path: string) {
        const abs = this.resolve(path)
        if (! await this.isDirectory(abs)) {
            await mkdirp(abs)
        }
    }

    async delete(path: string) {
        const abs = this.resolve(path)
        await rimraf(abs)
    }

    private async isDirectory(path: string): Promise<boolean> {
        try {
            const stats = await stat(path)
            return stats.isDirectory()
        } catch (_error) {
            return false
        }
    }

    private async ensureDirectory() {
        if (! await this.isDirectory(this.directory)) {
            await mkdirp(this.directory)
            this.logger.info('Created data directory.')
        }
    }
}
