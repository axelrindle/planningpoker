import { AwilixContainer } from 'awilix'
import { loadControllers, scopePerRequest } from 'awilix-express'
import bodyParser from 'body-parser'
import { IConfig } from 'config'
import express, { Request } from 'express'
import helmet from 'helmet'
import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import { cwd } from './util.js'

const app = express()

function registerMiddleware() {
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
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
        console.log('Someone connected.')
        socket.on('close', _hadError => console.log('Socket disconnected.'))
        socket.on('message', data => {
            try {
                const _data = data.toString()
                const theData = JSON.parse(_data)
                console.log('Someone said: ' + _data)
                socket.send(JSON.stringify({
                    requestId: theData.requestId,
                    message: 'OK'
                }))
            } catch (error: any) {
                console.log(error)
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
    console.log('WebSocket Server listening on port ' + wssPort);

    return app.listen(port, host, () => console.log('Http Server listening on port ' + port))
}
