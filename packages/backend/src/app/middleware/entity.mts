import { AwilixContainer } from 'awilix';
import { NextFunction, Request, Response } from 'express';
import DatabaseService from '../../service/database.mjs';

export function existsById(entity: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const container = req.app.get('container') as AwilixContainer
        const database = container.resolve<DatabaseService>('database')
        const entityId = req.params[entity + 'Id']
        const room = await database.querySingle(`select * from ${entity} where id = ${entityId}`)

        if (!room) {
            res.status(404).json({
                error: `No ${entity} found with ID ${entityId}!`
            })
            return
        }

        //@ts-ignore
        req[entity] = room

        next()
    }
}

export const roomExists = existsById('room')
export const cardExists = existsById('card')
