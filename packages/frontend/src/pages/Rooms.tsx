import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function PageRooms() {
    const [rooms, setRooms] = useState<any[]>([])

    useEffect(() => {
        fetch('http://10.231.55.48:3000/api/room')
            .then(response => response.json())
            .then(data => setRooms(data))
    }, [])

    return (
        <>
            <p className="font-bold text-lg">
                Rooms
            </p>
            <div className="flex flex-col items-start">
                {rooms.map(room => (
                    <Link
                        key={room.id}
                        to={`/room/${room.id}`}
                        className="bg-primary text-white px-8 py-4 rounded"
                    >
                        <p className="mb-2">
                            {room.name} <span className="text-gray-300">(#{room.id})</span>
                        </p>
                        <p className="text-xs">{room.description}</p>
                    </Link>
                ))}
            </div>
        </>
    )
}
