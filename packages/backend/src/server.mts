import { AwilixContainer } from 'awilix'
import { scopePerRequest } from 'awilix-express'
import bodyParser from 'body-parser'
import config, { IConfig } from 'config'
import cors from 'cors'
import express, { ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import { Server } from 'http'
import { WebSocketServer } from 'ws'
import requestLogger from './app/middleware/morgan.mjs'
import makeUploader from './app/upload.mjs'
import socketHandler from './app/websocket.mjs'
import { makeLogger } from './logger.mjs'
import { cwd } from './util.mjs'
import { loadControllers } from './util/awilix-express/controller.js'

const logger = makeLogger('server')
const app = express()

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.error(err.stack)
    res.set('Content-Type', 'text/plain')
    res.status(500).send(err.stack)
}

function registerMiddleware() {
    app.use(helmet())
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    if (config.get('logging.http.enabled')) {
        app.use(requestLogger(config, logger))
    }

    app.use(handleError)
    app.set('error handler', handleError);
}

async function loadRoutes() {
    app.use((req, res, next) => {
        const container = req.app.get('container') as AwilixContainer
        if (container) {
            scopePerRequest(container)(req, res, next)
        }
        else {
            next()
        }
    })
    app.use(await loadControllers('app/route/*', { cwd: cwd(import.meta.url) }))
}

export async function startServer(container: AwilixContainer): Promise<Server> {
    app.set('container', container)

    registerMiddleware()
    await loadRoutes()

    app.use('/upload', makeUploader(container))

    const config = container.resolve('config') as IConfig
    const host = config.get('server.host') as string
    const port = parseInt(config.get('server.port') as string)

    // TODO: Expose via /socket
    const wssPort = port + 1
    const wss = new WebSocketServer({
        port: wssPort
    })
    wss.on('connection', socketHandler(container))
    app.get('/api/socket', (req, res) => {
        res.json({
            url: req.hostname + ':' + wssPort
        })
    })
    logger.info('WebSocket Server listening on port ' + wssPort);

    return app.listen(port, host, () => logger.info('Http Server listening on port ' + port))
}
