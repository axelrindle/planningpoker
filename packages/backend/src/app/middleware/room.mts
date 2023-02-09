import { AwilixContainer } from 'awilix';
import { NextFunction, Request, Response } from 'express';
import DatabaseService from '../../service/database.mjs';

export async function roomExists(req: Request, res: Response, next: NextFunction) {
    const container = req.app.get('container') as AwilixContainer
    const database = container.resolve<DatabaseService>('database')
    const roomId = req.params['roomId']
    const room = await database.querySingle('select * from room where id = ' + roomId)

    if (!room) {
        res.status(404).json({
            error: `No room found with ID ${roomId}!`
        })
        return
    }

    req.room = room

    next()
}
