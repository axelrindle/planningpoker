import { readFile } from 'fs/promises'
import { basename, join } from 'path'
import { format } from 'sql-formatter'
import { default as sqlite3 } from 'sqlite3'
import { Logger } from 'winston'
import { makeLogger } from '../logger.mjs'
import { Service } from '../types.mjs'
import { glob } from '../util.mjs'
import StorageService from './storage.mjs'

interface Migration {
    name: string
    execution: number
    hash: string
}

export default class DatabaseService extends Service {

    readonly priority = 2
    private logger: Logger
    private storage: StorageService

    private _database?: sqlite3.Database

    constructor(storage: StorageService) {
        super()

        this.logger = makeLogger('database')
        this.storage = storage
    }

    private get database(): sqlite3.Database {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._database!
    }

    override async init(): Promise<void> {
        this._database = new sqlite3.Database(this.storage.resolve('db.sqlite'))
        this._database.on('trace', sql => {
            this.logger.debug('Executing SQL: \n' + format(sql, {
                language: 'sqlite',
                indentStyle: 'tabularLeft'
            }))
        })

        await this.migrate()
    }

    private async migrate() {
        let counter = 0
        this.logger.info('Running migrations')

        let migrations: Migration[] = []
        try {
            migrations = await this.queryAll('select * from migration') as Migration[]
        } catch (error: any) {
            if (!/no such table/.test(error.message)) {
                throw error
            }
        }

        const cwd = join(process.cwd(), 'resources/database')
        const migrationFiles = await glob('*.sql', { cwd })
        for (const file of migrationFiles) {
            const name = basename(file, '.sql')
            if (migrations.findIndex(el => el.name === name) === -1) {
                this.logger.info('Migrating ' + name)
                const sql = await readFile(join(cwd, file))
                await this.execute(sql.toString())
                await this.execute(`
                    insert into migration values (null, '${name}', ${Date.now()})
                `)
                counter++
            }
        }

        this.logger.info(`Ran ${counter} migrations`)
    }

    execute(sql: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.database.exec(sql, err => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

    querySingle<R = any>(sql: string): Promise<R> {
        return new Promise((resolve, reject) => {
            this.database.get(sql, (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }

    queryAll<R = any>(sql: string): Promise<R[]> {
        return new Promise((resolve, reject) => {
            this.database.all(sql, (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }

    override dispose(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.database.close(err => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

}
