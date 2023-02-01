import { MutationFunction, useQuery } from '@tanstack/react-query'
import { useSelector } from '../store/index'
import { FormData } from '../store/slices/formData'
import { FormError } from '../util/error'

export function useCards() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    return useQuery<any, any>({
        queryKey: ['cards'],
        queryFn: () => fetch(`${apiUrl}/api/card`).then(response => response.json())
    })
}

export function createCard(apiUrl: string): MutationFunction<Response, FormData> {
    return async (data) => {
        const response = await fetch(new URL('/api/card', apiUrl), {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        switch (response.status) {
            case 200:
                return response
            case 400:
                const details = await response.json()
                throw new FormError(details)
            default:
                throw new Error('Request failed!')
        }
    }
}
