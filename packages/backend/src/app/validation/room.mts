import { checkSchema } from 'express-validator'
import DatabaseService from '../../service/database.mjs'
import { Request } from '../../types.mjs'

async function isNameUnique(req: Request, value: string) {
    const database = req.container.resolve<DatabaseService>('database')
    const room = await database.querySingle('select id from room where name = ?', [value])
    if (room) {
        return Promise.reject('This name is already taken!')
    }
    return undefined
}

export const validateRoomCreation = checkSchema({
    name: {
        isString: true,
        notEmpty: {
            options: {
                ignore_whitespace: true
            }
        },
        custom: {
            options: async (value, meta) => {
                const req = meta.req as Request
                return isNameUnique(req, value)
            }
        }
    },
    description: {
        isString: true,
        optional: true,
    },
    userLimit: {
        isInt: {
            options: {
                min: 2
            }
        },
        optional: {
            options: {
                nullable: true
            }
        },
        toInt: true,
    },
    password: {
        errorMessage: 'Password must consist of a minimum of 8 characters!',
        isString: true,
        optional: {
            options: {
                nullable: true
            }
        },
        isLength: {
            options: {
                min: 8
            }
        }
    }
}, ['body'])

export const validateRoomUpdate = checkSchema({
    name: {
        optional: true,
        isString: true,
        notEmpty: {
            options: {
                ignore_whitespace: true
            }
        },
        custom: {
            options: async (value, meta) => {
                const req = meta.req as Request

                // dont check if name did not change
                if (value === req.room.name) {
                    return undefined
                }

                return isNameUnique(req, value)
            }
        }
    },
    description: {
        isString: true,
        notEmpty: {
            options: {
                ignore_whitespace: true
            }
        },
        optional: {
            options: {
                nullable: true
            }
        },
    },
    userLimit: {
        optional: {
            options: {
                nullable: true,
            },
        },
        isInt: {
            options: {
                min: 2,
            }
        },
        toInt: true,
    },
    password: {
        errorMessage: 'Password must consist of a minimum of 8 characters!',
        isString: true,
        optional: {
            options: {
                nullable: true
            }
        },
        isLength: {
            options: {
                min: 8
            }
        }
    }
}, ['body'])
