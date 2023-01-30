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
}

export type Event = 'HELLO' | 'UPDATE' | 'SELECT' | 'DELETE'

export interface Message {
    userId?: string
    event: Event
    data: any
}
