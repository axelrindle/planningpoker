import { createController } from 'awilix-express'
import UploadController from '../controller/UploadController'

export default createController(UploadController)
    .prefix('/uploads')
    .get('/:hash', 'serve')
