import { checkSchema } from 'express-validator'
import DatabaseService from '../../service/database.mjs'
import { Request } from '../../types.mjs'

export const validateCardCreation = checkSchema({
    name: {
        isString: true,
        custom: {
            options: async (value, meta) => {
                const req = meta.req as Request
                const database = req.container.resolve<DatabaseService>('database')
                const room = await database.querySingle('select id from card where name = ?', [value])
                if (room) {
                    return Promise.reject('This name is already taken!')
                }
                return undefined
            }
        }
    },
    value: {
        isInt: {
            options: {
                min: 0
            }
        },
        toInt: true,
    },
})

export const validateCardUpdate = checkSchema({
    name: {
        isString: true,
        optional: true,
    },
    value: {
        isInt: true,
        toInt: true,
        optional: true,
    },
    image: {
        isString: true,
        optional: true,
        custom: {
            options: async (value, meta) => {
                const req = meta.req as Request
                const database = req.container.resolve<DatabaseService>('database')
                const upload = await database.querySingle('select id from upload where hash = ?', [value])
                if (!upload) {
                    return Promise.reject(`No upload found with hash ${value}!`)
                }
                return undefined
            }
        }
    }
})
