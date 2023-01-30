import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export default function validate(schema: Joi.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body)
            next()
        } catch (error: any) {
            res.status(400).json({
                error: error.message,
                details: error.details
            })
        }
    }
}
