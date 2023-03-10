import { AwilixContainer } from 'awilix'
import { Request as ExpressRequest } from 'express'

export abstract class Service {
    /**
     * Defines the priority of this service.
     * The higher the number the lower the priority.
     * Services with priority zero are loaded first, then comes one and so on.
     */
    abstract readonly priority: number

    async init(): Promise<void> {
        return Promise.resolve()
    }

    async dispose(): Promise<void> {
        return Promise.resolve()
    }
}

export interface Room {
    id: number
    name: string
    description?: string
    userLimit?: number
    password?: string
}

export type Event = 'HELLO' | 'UPDATE' | 'SELECT' | 'RENAME' | 'DELETE'

export interface Message {
    userId?: string
    event: Event
    data: any
}

export interface Request extends ExpressRequest {
    readonly container: AwilixContainer
}

export type ShutdownFunction = (customHook?: () => Promise<void>) => Promise<void>
