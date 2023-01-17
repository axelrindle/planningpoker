import { createController } from 'awilix-express'
import RoomController from '../controller/RoomController.js'

export default createController(RoomController)
    .prefix('/room')
    .get('/', 'list')
    .post('/', 'create')
