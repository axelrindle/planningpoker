import { MutationFunction, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useSelector } from '../store';
import { FormData, FormError } from '../types'

export function useRooms() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    return useQuery<any, any>({
        queryKey: ['rooms'],
        queryFn: () => fetch(`${apiUrl}/api/room`).then(response => response.json())
    })
}

export function useRoom(roomId: string|number, opts?: UseQueryOptions) {
    const apiUrl = useSelector(state => state.config.apiUrl)
    return useQuery<any, any>({
        ...opts,
        queryKey: ['rooms', roomId],
        queryFn: () => fetch(`${apiUrl}/api/room/${roomId}`).then(response => response.json()),
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
            case 201:
                return response
            case 400:
                const details = await response.json()
                throw new FormError(details)
            default:
                throw new Error('Request failed!')
        }
    }
}

export function updateRoom(apiUrl: string, roomId: number): MutationFunction<Response, FormData> {
    return async (data) => {
        const copy = Object.assign({}, data)
        Object.keys(copy).forEach(key => {
            if (!copy[key]) {
                copy[key] = null
            }
        })

        const response = await fetch(new URL('/api/room/' + roomId, apiUrl), {
            body: JSON.stringify(copy),
            method: 'PUT',
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
