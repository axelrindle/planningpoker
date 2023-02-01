import { UseMutationResult } from '@tanstack/react-query'
import { FormData } from '../store/slices/formData'

export class FormError extends Error {

    readonly details: any[]

    constructor(details: any[]) {
        super('Form Request failed!')
        this.details = details
    }

}

export function getError(mutation: UseMutationResult<Response, FormError, FormData, unknown>, key: string): string | undefined {
    if (!mutation.error?.details) return undefined
    if (!Array.isArray(mutation.error?.details)) return undefined

    const detail = mutation.error.details.find(el => el.param === key)
    return detail?.msg
}
