export class FormError extends Error {

    readonly details: any[]

    constructor(details: any[]) {
        super('Form Request failed!')
        this.details = details
    }

}
