import { createController } from 'awilix-express'
import RoomController from '../controller/RoomController.js'

export default createController(RoomController)
    .prefix('/api/room')
    .get('/', 'list')
    .get('/:roomId', 'read')
    .post('/', 'create')
    .delete('/:roomId', 'delete')
