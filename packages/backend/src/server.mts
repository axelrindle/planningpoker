import { AwilixContainer } from 'awilix'
import { scopePerRequest } from 'awilix-express'
import bodyParser from 'body-parser'
import { IConfig } from 'config'
import cors from 'cors'
import express, { ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import { createServer, Server } from 'http'
import { createProxyMiddleware } from 'http-proxy-middleware'
import PrettyError from 'pretty-error'
import { WebSocketServer } from 'ws'
import requestLogger from './app/middleware/morgan.mjs'
import makeUploader from './app/upload.mjs'
import socketHandler from './app/websocket.mjs'
import { makeLogger } from './logger.mjs'
import { cwd } from './util.mjs'
import { loadControllers } from './util/awilix-express/controller.js'

const logger = makeLogger('server')
const app = express()

const prettyError = new PrettyError()
const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.error('Something went wrong:\n\n' + prettyError.render(err, false, true))
    res.status(500).json({
        error: err.message
    })
}

async function listen(host: string, port: number, server: Server): Promise<void> {
    return new Promise((resolve, reject) => {
        server.once('listening', resolve)
        server.once('error', reject)
        server.listen(port, host)
    })
}

export async function startServer(container: AwilixContainer): Promise<Server[]> {
    const config = container.resolve('config') as IConfig

    app.use(helmet())
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    if (config.get('logging.http.enabled')) {
        app.use(requestLogger(config, logger))
    }

    app.set('container', container)
    app.set('error handler', handleError)
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
    app.use(handleError)

    app.use('/upload/card', await makeUploader(container, 'card'))

    const host = config.get('server.host') as string
    const port = parseInt(config.get('server.port') as string)
    const wssPort = parseInt(config.get('server.socketPort') as string)

    const httpServer = createServer(app)
    const socketServer = createServer()

    // TODO: Expose via /socket
    const wss = new WebSocketServer({
        noServer: true
    })
    socketServer.on('upgrade', socketHandler.onUpgrade(wss))
    wss.on('connection', socketHandler.onConnection(container))
    app.use('/socket', createProxyMiddleware({
        target: `http://localhost:${wssPort}`,
        changeOrigin: true,
        pathRewrite: {
            '^/socket': ''
        },
        ws: true,
        logProvider: () => logger
    }))
    app.get('/api/socket', (req, res) => {
        res.json({
            url: req.hostname + ':' + wssPort
            // url: req.hostname + ':' + port + '/socket'
        })
    })

    await listen(host, port, httpServer)
    logger.info('Http Server listening on port ' + port)

    await listen(host, wssPort, socketServer)
    logger.info('WebSocket Server listening on port ' + wssPort)

    return [httpServer, socketServer]
}
