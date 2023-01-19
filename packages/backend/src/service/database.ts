import { format } from 'sql-formatter'
import { Database } from 'sqlite3'
import { Logger } from 'winston'
import { makeLogger } from '../logger.js'
import { Service } from '../types.js'
import StorageService from './storage.js'

export default class DatabaseService extends Service {

    readonly priority = 2
    private logger: Logger
    private database: Database

    constructor(storage: StorageService) {
        super()

        this.logger = makeLogger('database')
        this.database = new Database(storage.resolve('db.sqlite'))

        this.database.on('trace', sql => {
            this.logger.debug('Executing SQL: \n' + format(sql, {
                language: 'sqlite',
                indentStyle: 'tabularLeft'
            }))
        })
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
