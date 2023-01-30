import { createController } from 'awilix-express'
import Joi from 'joi'
import RoomController from '../controller/RoomController.mjs'
import validate from '../middleware/validation.mjs'

export default createController(RoomController)
    .prefix('/api/room')
    .get('/', 'list')
    .get('/:roomId', 'read')
    .post('/', 'create', {
        before: [validate(Joi.object({
            name: Joi.string().required().min(1),
            description: Joi.string().max(100).optional(),
            password: Joi.string().min(8).optional(),
            limit: Joi.number().integer().min(2).optional()
        }))]
    })
    .delete('/:roomId', 'delete')
