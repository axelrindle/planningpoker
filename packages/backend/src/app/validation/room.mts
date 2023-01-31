import { checkSchema } from 'express-validator'
import DatabaseService from '../../service/database.mjs'
import { Request } from '../../types.mjs'

export const validateRoomCreation = checkSchema({
    name: {
        isString: true,
        custom: {
            options: async (value, meta) => {
                const req = meta.req as Request
                const database = req.container.resolve<DatabaseService>('database')
                const room = await database.querySingle('select id from room where name = ?', [value])
                if (room) {
                    return Promise.reject('This name is already taken!')
                }
                return undefined
            }
        }
    },
    description: {
        isString: true,
        optional: true,
    },
    limit: {
        isInt: true,
        optional: true,
        isLength: {
            options: {
                min: 2
            }
        },
        toInt: true,
    },
    password: {
        errorMessage: 'Password must consist of a minimum of 8 characters!',
        isString: true,
        optional: true,
        isLength: {
            options: {
                min: 8
            }
        }
    }
}, ['body'])
