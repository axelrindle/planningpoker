import { MutationFunction, useQuery } from '@tanstack/react-query';
import { useSelector } from '../store';
import { FormData } from '../store/slices/formData'
import { FormError } from '../util/error'

export function useRooms() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    return useQuery<any, any>({
        queryKey: ['rooms'],
        queryFn: () => fetch(`${apiUrl}/api/room`).then(response => response.json())
    })
}

export function useRoom(roomId: string) {
    const apiUrl = useSelector(state => state.config.apiUrl)
    return useQuery<any, any>({
        queryKey: ['rooms', roomId],
        queryFn: () => fetch(`${apiUrl}/api/room/${roomId}`).then(response => response.json())
    })
}

export function createRoom(apiUrl: string): MutationFunction<Response, FormData> {
    return async (data) => {
        const response = await fetch(new URL('/api/room', apiUrl), {
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
