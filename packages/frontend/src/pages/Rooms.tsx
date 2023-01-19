import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function PageRooms() {
    const [rooms, setRooms] = useState<any[]>([])

    function loadRooms() {
        fetch('http://127.0.0.1:3000/api/room')
            .then(response => response.json())
            .then(data => setRooms(data))
    }

    useEffect(() => loadRooms(), [])

    return (
        <>
            <div className="grid grid-cols-header items-center pb-4 mb-8 border-b-2 border-black">
                <div>
                    <p className="font-bold text-lg">
                        Rooms
                    </p>
                    <p>Select a Room to join down below.</p>
                </div>
                <div>
                    <p
                        className="bg-primary text-white px-8 py-4 rounded cursor-pointer"
                        onClick={() => loadRooms()}
                    >
                        <FontAwesomeIcon icon={faRefresh} />
                        <span className="ml-2">Refresh</span>
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-8">
                {rooms.length === 0 && (
                    <p>
                        No Rooms yet!
                    </p>
                )}
                {rooms.length > 0 && rooms.map(room => (
                    <Link
                        key={room.id}
                        to={`/room/${room.id}`}
                        className="bg-primary text-white px-8 py-4 rounded"
                    >
                        <p className="mb-2">
                            <span>{room.name}</span>
                            &nbsp;
                            <span className="text-gray-300">(#{room.id})</span>
                        </p>
                        <p className="text-xs">
                            {room.description}
                        </p>
                        <p className="text-xs">
                            {room.limit === null && <span>{room.users} users</span>}
                            {room.limit !== null && <span>{room.users} / {room.limit} users</span>}
                        </p>
                    </Link>
                ))}
            </div>
        </>
    )
}
