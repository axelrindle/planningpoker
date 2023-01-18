import { createController } from 'awilix-express'
import PresetController from '../controller/PresetController.js'

export default createController(PresetController)
    .prefix('/api/preset')
    .get('/', 'list')
