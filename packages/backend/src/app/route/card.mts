import { createController } from 'awilix-express'
import CardController from '../controller/CardController.mjs'
import validate from '../middleware/validation.mjs'
import { validateCardCreation, validateCardUpdate } from '../validation/card.mjs'

export default createController(CardController)
    .prefix('/api/card')
    .get('/', 'list')
    .get('/:id', 'read')
    .post('/', 'create', {
        before: [
            validateCardCreation,
            validate,
        ]
    })
    .put('/:id', 'update', {
        before: [
            validateCardUpdate,
            validate
        ]
    })
