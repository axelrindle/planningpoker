import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import ModalCreateRoom from '../modals/CreateRoom'
import { useRooms } from '../query/room'

interface RoomListProps {
    rooms: any[]
}

function RoomList({ rooms }: RoomListProps) {
    if (rooms === undefined) {
        return <></>
    }

    return (
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
    )
}

export default function PageRooms() {
    const [isOpen, setOpen] = useState(false)

    const { isLoading, error, data: rooms, refetch } = useRooms()

    return (
        <>
            <div className="grid grid-cols-header items-center pb-4 mb-8 border-b-2 border-black dark:border-gray-300">
                <div>
                    <p className="font-bold text-lg">
                        Rooms
                    </p>
                    <p>Select a Room to join down below.</p>
                </div>
                <div className="flex flex-row gap-4">
                    <Button
                        label="Refresh"
                        icon={faRefresh}
                        onClick={() => refetch()}
                        hideLabel
                        disabled={isLoading}
                    />
                    <Button
                        label="Add"
                        icon={faPlus}
                        onClick={() => setOpen(true)}
                    />
                </div>
            </div>

            {isLoading ? <p>Loading...</p> : <RoomList rooms={rooms} />}
            {error && (
                <p className="font-bold text-red-500">
                    Error: {error.message}
                </p>
            )}

            <ModalCreateRoom
                isOpen={isOpen}
                close={() => setOpen(false)}
            />
        </>
    )
}
