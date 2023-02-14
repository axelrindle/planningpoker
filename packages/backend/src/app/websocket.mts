import { AwilixContainer } from 'awilix'
import { randomUUID } from 'crypto'
import { IncomingMessage } from 'http'
import PrettyError from 'pretty-error'
import { Duplex } from 'stream'
import { parse } from 'url'
import { WebSocket, WebSocketServer } from 'ws'
import { makeLogger } from '../logger.mjs'
import DatabaseService from '../service/database.mjs'
import GameService from '../service/game.mjs'
import { Message, Room } from '../types.mjs'
import { checkHash } from '../util/hash.mjs'

declare module 'http' {
    interface IncomingMessage {
        room: Room
    }
}

const logger = makeLogger('websocket')
const prettyError = new PrettyError()
const users: string[] = []

function findUuid(): string {
    let found = false
    let count = 0
    while (!found) {
        const uuid = randomUUID()
        if (! users.includes(uuid)) {
            users.push(uuid)
            found = true
            return uuid
        }
        count++
        if (count >= 100) {
            break
        }
    }
    throw new Error('Unable to find a new UUID!')
}

function sendMessage(socket: WebSocket, message: Message) {
    socket.send(JSON.stringify(message))
}

function onUpgrade(wss: WebSocketServer) {
    return (req: IncomingMessage, socket: Duplex, head: Buffer) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req)
        })
    }
}

function onConnection(container: AwilixContainer) {
    const database = container.resolve<DatabaseService>('database')
    const gameManager = container.resolve<GameService>('game')

    return async (socket: WebSocket, req: IncomingMessage) => {
        const url = parse(req.url!, true)
        if (!url.query['room']) {
            socket.send(JSON.stringify({
                error: 'Missing room ID!'
            }))
            socket.close(4000)
            return
        }

        const room = await database.querySingle(`select * from room where id = ${url.query['room']}`) as Room
        if (!room) {
            socket.send(JSON.stringify({
                error: 'Unknown room ID!'
            }))
            socket.close(4000)
            return
        }

        if (room.userLimit && gameManager.getUsers(room) >= room.userLimit) {
            socket.send(JSON.stringify({
                error: 'This room is full!'
            }))
            socket.close(4000)
            return
        }

        if (room.password) {
            const end = () => {
                socket.send(JSON.stringify({
                    error: 'Unauthorized!'
                }))
                socket.close(3000)
            }
            const token = req.headers.authorization
            if (!token || !token?.startsWith('Bearer')) {
                end()
            }
            const split = token?.split(' ')
            if (split?.length != 2) {
                end()
            }
            if (!await checkHash(room.password, split?.[1])) {
                end()
            }
            return
        }

        function sendUpdate() {
            gameManager.broadcast(room, {
                event: 'UPDATE',
                data: {
                    state: gameManager.getState(room),
                    users: gameManager.getUiState(room)
                },
            })
        }

        // assign user id
        const uuid = findUuid()
        const user = gameManager.join(room, uuid, socket)
        if (url.query['username']) {
            user.name = url.query['username'] as string
        }
        sendMessage(socket, {
            event: 'HELLO',
            data: {
                userId: uuid
            }
        })
        logger.debug('Connection opened: ' + uuid)

        sendUpdate()

        socket.on('error', error => {
            logger.error('Something went wrong:\n\n' + prettyError.render(error))
        })

        socket.on('close', (code, reason) => {
            // game is undefined in case it has been deleted
            if (gameManager.findGameByRoom(room) !== undefined) {
                gameManager.quit(room, uuid)
                sendUpdate()
            }
            logger.debug(`Connection closed: ${uuid}`, {
                uuid, code, reason
            })
        })

        socket.on('message', data => {
            try {
                const theData = JSON.parse(data.toString()) as Message

                if (!theData.userId) {
                    socket.send(JSON.stringify({
                        error: 'No user ID sent!'
                    }))
                    return
                }
                if (!users.includes(theData.userId)) {
                    socket.send(JSON.stringify({
                        error: 'Unknown user ID!'
                    }))
                    return
                }

                const user = gameManager.findUser(uuid)!
                switch (theData.event) {
                    case 'SELECT':
                        // eslint-disable-next-line no-case-declarations
                        user.card = theData.data.cardId
                        sendUpdate()
                        break
                    case 'RENAME':
                        user.name = theData.data.username
                        sendUpdate()
                        break
                    default:
                        socket.send(JSON.stringify({
                            error: `Unknown or unsupported event "${theData.event}" !`
                        }))
                        break
                }
            } catch (error: any) {
                logger.info(error)
                socket.send(JSON.stringify({
                    error: error.message
                }))
            }
        })
    }
}

export default { onUpgrade, onConnection }
