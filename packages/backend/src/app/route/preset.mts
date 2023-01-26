import { createController } from 'awilix-express'
import PresetController from '../controller/PresetController.mjs'

export default createController(PresetController)
    .prefix('/api/preset')
    .get('/', 'list')
