import { AwilixContainer } from 'awilix'
import { loadControllers, scopePerRequest } from 'awilix-express'
import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import { cwd } from './util.js'

const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    const container = req.app.get('container') as AwilixContainer
    if (container) {
        scopePerRequest(container)(req, res, next)
    }
    else {
        next()
    }
})
app.use(loadControllers('app/route/*', { cwd: cwd(import.meta.url) }))

export default app
