import { IConfig } from 'config'
import { stat } from 'fs/promises'
import mkdirp from 'mkdirp'
import { isAbsolute, join, resolve } from 'path'
import { Initable } from '../types.js'

export default class StorageService implements Initable {

    private readonly configKey = 'data_directory'
    private directory: string

    constructor(config: IConfig) {
        const dataDirectory = this.getConfigValue(config)
        if (!dataDirectory) {
            this.directory = join(process.cwd(), 'data')
        }
        else if (!isAbsolute(dataDirectory)) {
            this.directory = resolve(process.cwd(), dataDirectory)
        }
        else {
            this.directory = resolve(dataDirectory)
        }
    }

    async init() {
        await this.ensureDirectory()
    }

    resolve(path: string): string {
        return join(this.directory, path)
    }

    private getConfigValue(config: IConfig): string | undefined {
        if (config.has(this.configKey)) {
            return config.get(this.configKey) as string
        }

        return undefined
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
            console.log('Created data directory.')
        }
    }
}
