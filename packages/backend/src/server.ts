import { AwilixContainer } from 'awilix'
import { loadControllers, scopePerRequest } from 'awilix-express'
import bodyParser from 'body-parser'
import config, { IConfig } from 'config'
import express, { ErrorRequestHandler, Request } from 'express'
import helmet from 'helmet'
import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import requestLogger from './app/middleware/morgan.js'
import { makeLogger } from './logger.js'
import { cwd } from './util.js'

const logger = makeLogger('server')
const app = express()

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.error(err.stack)
    res.set('Content-Type', 'text/plain')
    res.status(500).send(err.stack)
}

function registerMiddleware() {
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    if (config.get('logging.http.enabled')) {
        app.use(requestLogger(config, logger))
    }

    app.use(handleError)
    app.set('error handler', handleError);
}

function loadRoutes() {
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
}

function registerWebsocket(wss: WebSocketServer) {
    wss.on('connection', (socket: WebSocket, _req: Request) => {
        logger.info('Someone connected.')
        socket.on('close', _hadError => logger.info('Socket disconnected.'))
        socket.on('message', data => {
            try {
                const theData = JSON.parse(data.toString())
                logger.info(theData?.data?.message)
                socket.send(JSON.stringify({
                    requestId: theData.requestId,
                    message: 'OK'
                }))
            } catch (error: any) {
                logger.info(error)
                socket.send(JSON.stringify({
                    error: error.message
                }))
            }
        })
    })
}

export function startServer(container: AwilixContainer): Server {
    app.set('container', container)

    registerMiddleware()
    loadRoutes()

    const config = container.resolve('config') as IConfig
    const host = config.get('server.host') as string
    const port = config.get('server.port') as number

    // TODO: Expose via /socket
    const wssPort = port + 1
    const wss = new WebSocketServer({
        port: wssPort
    })
    registerWebsocket(wss)
    logger.info('WebSocket Server listening on port ' + wssPort);

    return app.listen(port, host, () => logger.info('Http Server listening on port ' + port))
}
