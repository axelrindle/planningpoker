import { AwilixContainer } from 'awilix'
import { randomUUID } from 'crypto'
import { IncomingMessage } from 'http'
import { parse } from 'url'
import { WebSocket } from 'ws'
import { makeLogger } from '../logger.mjs'
import DatabaseService from '../service/database.mjs'
import GameService from '../service/game.mjs'
import { Message } from '../types.mjs'

const logger = makeLogger('websocket')
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

export default function socketHandler(container: AwilixContainer) {
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

        const room = await database.querySingle(`select * from room where id = ${url.query['room']}`)
        if (!room) {
            socket.send(JSON.stringify({
                error: 'Unknown room ID!'
            }))
            socket.close(4000)
            return
        }

        if (room.limit && gameManager.getUsers(room) >= room.limit) {
            socket.send(JSON.stringify({
                error: 'This room is full!'
            }))
            socket.close(4000)
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
        gameManager.join(room, uuid, socket)
        sendMessage(socket, {
            event: 'HELLO',
            data: {
                userId: uuid
            }
        })
        logger.debug('Connection opened: ' + uuid)

        sendUpdate()

        socket.on('close', _hadError => {
            // game is undefined in case it has been deleted
            if (gameManager.findGameByRoom(room) !== undefined) {
                gameManager.quit(room, uuid)
                sendUpdate()
                logger.debug('Connection closed: ' + uuid)
            }
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

                switch (theData.event) {
                    case 'DEBUG':
                        if (!logger.isDebugEnabled()) return
                        logger.debug(uuid + ' sent a message:')
                        process.stdout.write(JSON.stringify(theData.data, null, 4))
                        process.stdout.write('\n')
                        break
                    case 'SELECT':
                        // eslint-disable-next-line no-case-declarations
                        const user = gameManager.findUser(uuid)!
                        user.card = theData.data.cardId || undefined
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
