import { useQuery } from '@tanstack/react-query';
import { useSelector } from '../store';

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
