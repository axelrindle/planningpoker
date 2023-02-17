export type FormData = Record<string, any>

export class FormError extends Error {

    readonly details: any[]

    constructor(details: any[]) {
        super('Form Request failed!')
        this.details = details
    }

}
