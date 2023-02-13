import { Request, Response } from 'express'
import { Logger } from 'winston'
import { makeLogger } from '../../logger.mjs'
import DatabaseService from '../../service/database.mjs'
import GameService from '../../service/game.mjs'
import { hash } from '../../util/hash.mjs'

interface SqlSet {
    sql: string
    key: string
    value?: unknown
}

export default class RoomController {

    private logger: Logger
    private database: DatabaseService
    private game: GameService

    constructor(database: DatabaseService, game: GameService) {
        this.logger = makeLogger('RoomController')
        this.database = database
        this.game = game
    }

    async list(_req: Request, res: Response) {
        const rooms = await this.database.queryAll('select * from room')
        for (const room of rooms) {
            room.users = this.game.getUsers(room)
            room.private = room.password !== null
            delete room.password
        }
        res.json(rooms)
    }

    async read(req: Request, res: Response) {
        const room = Object.assign({}, req.room)

        //@ts-ignore
        room.private = room.password !== null
        delete room.password

        res.json(room)
    }

    async create(req: Request, res: Response) {
        const { name, description, limit, password } = req.body

        let passwordEncrypted: string|undefined = undefined
        if (password) {
            passwordEncrypted = await hash(password)
        }

        try {
            await this.database.run('insert into room values (null, $name, $description, $limit, $password)', {
                $name: name,
                $description: description,
                $limit: limit,
                $password: passwordEncrypted
            })
            const id = await this.database.querySingle('select id from room where name = ?', [name])
            await this.game.updateGames()
            res
                .header('Location', '/api/room/' + id)
                .status(201)
                .end()
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                error: error.message
            })
        }
    }

    async update(req: Request, res: Response) {
        const { name, description, limit, password } = req.body

        let passwordEncrypted: string|null = null
        if (password) {
            passwordEncrypted = await hash(password)
        }

        const updates: Record<string, string|null|undefined> = {
            name, description, limit, password: passwordEncrypted
        }

        const sets: SqlSet[] = Object.keys(updates)
            .map(key => {
                if (updates[key] === undefined) return undefined
                else if (updates[key] === null) return {
                    sql: `\`${key}\` = NULL`,
                    key,
                }
                else return {
                    sql: `\`${key}\` = $${key}`,
                    key,
                    value: updates[key]
                }
            })
            .filter(val => val !== undefined)

        if (sets.length === 0) {
            res.end()
            return
        }

        const sql = `
        UPDATE room
        SET ${sets.map(el => el.sql).join(',\n')}
        WHERE id = ${req.room.id}
        `

        try {
            const params = sets
                .filter(el => el.value !== undefined)
                .reduce((prev, cur) => ({ ...prev, ['$' + cur.key]: cur.value }), {})
            await this.database.run(sql, params)
            res.end()
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                error: error.message
            })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            this.game.delete(req.room)
            await this.database.execute('delete from room where id = ' + req.room.id)
            res.end()
        } catch (error: any) {
            const message = error.message ?? error ?? 'Unknown error!'
            this.logger.error(message, error)
            res.status(500).json({
                error: message
            })
        }
    }
}
