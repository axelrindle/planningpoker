import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export default function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json(errors.array())
        return
    }

    next()
}
