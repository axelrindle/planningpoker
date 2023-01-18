export interface Room {
    id: number
    name: string
}

export interface Initable {
    init(): Promise<void>
}

export interface Disposable<T = void> {
    dispose(): Promise<T>
}
