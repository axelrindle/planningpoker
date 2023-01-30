import { faPencil, faPlus, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Item, Menu, Separator, useContextMenu } from 'react-contexify'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import ModalCreateRoom from '../modals/CreateRoom'
import ModalDeleteRoom from '../modals/DeleteRoom'
import { useRooms } from '../query/room'
import { useSelector } from '../store'

const CONTEXT_MENU_ID = 'context-menu-rooms'

type Modal = 'create' | 'delete'

export default function PageRooms() {
    const [openModal, setOpenModal] = useState<Modal|null>(null)
    const [roomId, setRoomId] = useState(0)
    const contextMenu = useContextMenu({
        id: CONTEXT_MENU_ID
    })
    const darkModeActive = useSelector(state => state.config.darkModeActive)

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
                        onClick={() => setOpenModal('create')}
                    />
                </div>
            </div>

            {isLoading ? <p>Loading...</p> : (
                <div className="grid grid-cols-4 gap-8 items-start">
                    {rooms.length === 0 && (
                        <p>
                            No Rooms yet!
                        </p>
                    )}
                    {rooms.length > 0 && rooms.map((room: any) => (
                        <Link
                            key={room.id}
                            to={`/room/${room.id}`}
                            className="bg-primary text-white px-8 py-4 rounded"
                            onContextMenu={event => {
                                setRoomId(room.id)
                                contextMenu.show({ event })
                            }}
                        >
                            <p className="mb-2">
                                <span>{room.name}</span>
                                &nbsp;
                                <span className="text-gray-300">(#{room.id})</span>
                            </p>
                            {room.description && (
                                <p className="text-xs">
                                    {room.description}
                                </p>
                            )}
                            <p className="text-xs">
                                {room.limit === null && <span>{room.users} users</span>}
                                {room.limit !== null && <span>{room.users} / {room.limit} users</span>}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
            {error && (
                <p className="font-bold text-red-500">
                    Error: {error.message}
                </p>
            )}

            <ModalCreateRoom
                isOpen={openModal === 'create'}
                close={() => setOpenModal(null)}
            />
            <ModalDeleteRoom
                isOpen={openModal === 'delete'}
                close={() => setOpenModal(null)}
                roomId={roomId}
            />

            <Menu
                id={CONTEXT_MENU_ID}
                theme={darkModeActive ? 'light' : 'dark'}
                animation="slide"
            >
                <Item disabled>
                    Room #{roomId}
                </Item>
                <Separator />
                <Item>
                    <FontAwesomeIcon icon={faPencil} />
                    <span className="ml-4">Edit</span>
                </Item>
                <Item onClick={() => setOpenModal('delete')}>
                    <FontAwesomeIcon icon={faTrash} />
                    <span className="ml-4">Delete</span>
                </Item>
            </Menu>
        </>
    )
}
