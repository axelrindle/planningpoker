import { createController } from 'awilix-express'
import RoomController from '../controller/RoomController.mjs'
import { roomExists } from '../middleware/room.mjs'
import validate from '../middleware/validation.mjs'
import { validateRoomCreation } from '../validation/room.mjs'

export default createController(RoomController)
    .prefix('/api/room')
    .get('/', 'list')
    .get('/:roomId', 'read', {
        before: [
            roomExists
        ]
    })
    .post('/', 'create', {
        before: [
            validateRoomCreation,
            validate
        ]
    })
    .delete('/:roomId', 'delete', {
        before: roomExists
    })
