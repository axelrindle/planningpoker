import { createController } from 'awilix-express'
import UploadController from '../controller/UploadController.js'

export default createController(UploadController)
    .prefix('/uploads')
    .get('/:hash', 'serve')
