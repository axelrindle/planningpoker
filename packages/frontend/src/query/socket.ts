import { useQuery } from '@tanstack/react-query'
import { useSelector } from '../store'

export function useSocketUrl() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    return useQuery<any, any>({
        queryKey: ['socket-url'],
        queryFn: () => fetch(`${apiUrl}/api/socket`).then(response => response.json())
    })
}
