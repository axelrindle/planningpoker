import { WebSocket } from 'ws'
import { Message, Room, Service } from '../types.js'
import DatabaseService from './database.js'

type GameState = 'CHOOSE' | 'SHOW'

interface User {
    socket: WebSocket
    id: string
    name: string
    card?: number
}

interface Game {
    users: User[]
}

function state(game: Game): GameState {
    if (game.users.findIndex(el => el.card === undefined) !== -1) {
        return 'CHOOSE'
    }

    return 'SHOW'
}

export default class GameService extends Service {

    readonly priority = 10
    private database: DatabaseService
    private games: Record<number, Game> = {}

    constructor(database: DatabaseService) {
        super()

        this.database = database
    }

    override async init(): Promise<void> {
        await this.updateGames()
    }

    async updateGames() {
        const rooms: Room[] = await this.database.queryAll('select id, name from room')
        for (const room of rooms) {
            this.games[room.id] = {
                users: []
            }
        }
    }

    findGameByRoom(room: Room): Game | undefined {
        return this.games[room.id]
    }

    getState(room: Room) {
        const game = this.findGameByRoom(room)
        if (!game) {
            return undefined
        }

        return state(game)
    }

    getUsers(room: Room): number {
        const game = this.findGameByRoom(room)
        if (!game) {
            return 0
        }

        return game.users.length
    }

    getUiState(room: Room) {
        const game = this.findGameByRoom(room)
        if (!game) {
            return undefined
        }

        const theState = state(game)
        return game.users.map(user => {
            return {
                name: user.name,
                card: theState === 'SHOW' ? user.card : undefined,
                chosen: user.card !== undefined,
            }
        })
    }

    findUser(userId: string): User | undefined {
        for (const game of Object.values(this.games)) {
            for (const user of game.users) {
                if (user.id === userId) {
                    return user
                }
            }
        }

        return undefined
    }

    join(room: Room, user: string, socket: WebSocket) {
        const game = this.findGameByRoom(room)
        if (!game) {
            throw new Error('No game found?!')
        }

        game.users.push({
            id: user,
            name: 'Player ' + (game.users.length + 1),
            socket,
        })
    }

    quit(room: Room, user: string) {
        const game = this.findGameByRoom(room)
        if (!game) {
            throw new Error('No game found?!')
        }

        const index = game.users.findIndex(el => el.id === user)
        game.users.splice(index, 1)
    }

    broadcast(room: Room, message: Message) {
        const game = this.findGameByRoom(room)
        if (!game) {
            throw new Error('No game found?!')
        }

        const sockets = game.users.map(user => user.socket)
        for (const client of sockets) {
            client.send(JSON.stringify(message))
        }
    }

    delete(room: Room) {
        const game = this.findGameByRoom(room)
        if (!game) {
            throw new Error('No game found?!')
        }

        this.broadcast(room, {
            event: 'DELETE',
            data: {}
        })

        delete this.games[room.id]
    }

}
