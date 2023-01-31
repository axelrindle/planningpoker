import { createController } from 'awilix-express'
import RoomController from '../controller/RoomController.mjs'
import validate from '../middleware/validation.mjs'
import { validateRoomCreation } from '../validation/room.mjs'

export default createController(RoomController)
    .prefix('/api/room')
    .get('/', 'list')
    .get('/:roomId', 'read')
    .post('/', 'create', {
        before: [
            validateRoomCreation,
            validate
        ]
    })
    .delete('/:roomId', 'delete')
