import { IConfig } from 'config'
import { join } from 'path'
import { Database } from 'sqlite3'
import { Disposable } from '../types.js'

export default class DatabaseService implements Disposable {

    private database: Database

    constructor(config: IConfig) {
        const dataDirectory = config.get('data_directory') as string
        this.database = new Database(join(dataDirectory, 'db.sqlite'))

        this.database.on('trace', sql => {
            console.log('Executing SQL: ' + sql)
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

    dispose(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.database.close(err => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

}
