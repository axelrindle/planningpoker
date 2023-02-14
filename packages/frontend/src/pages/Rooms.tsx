import { faLock, faPencil, faPlus, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Item, Separator, useContextMenu } from 'react-contexify'
import { Link } from 'react-router-dom'
import illustrationVoid from '../assets/illustrations/undraw_void_-3-ggu.svg'
import Button from '../components/Button'
import ContextMenu from '../components/ContextMenu'
import Header from '../components/Header'
import ModalDeleteRoom from '../modals/DeleteRoom'
import ModalFormRoom from '../modals/FormRoom'
import { useRoom, useRooms } from '../query/room'

const CONTEXT_MENU_ID = 'context-menu-rooms'

type Modal = 'create' | 'edit' | 'delete'

function NoRooms(props: { add: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <img
                src={illustrationVoid}
                className="w-60"
                alt="man looking into the void"
            />
            <div className="text-center">
                <p className="font-bold text-lg mb-2">
                    Seems like there are no rooms ...
                </p>
                <p
                    className="underline cursor-pointer"
                    onClick={props.add}
                >
                    Why not create one?
                </p>
            </div>
        </div>
    )
}

export default function PageRooms() {
    const [openModal, setOpenModal] = useState<Modal|null>(null)
    const [roomId, setRoomId] = useState(0)
    const contextMenu = useContextMenu({
        id: CONTEXT_MENU_ID
    })

    const { isError, isLoading, error, data: _rooms, refetch } = useRooms()
    const room = useRoom(roomId, { enabled: openModal === 'edit' })
    const rooms = _rooms ?? []

    return (
        <>
            <Header
                title="Rooms"
                subtitle="Select a Room to join down below."
            >
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
            </Header>

            {!isError && !isLoading && rooms.length === 0 && (
                <NoRooms add={() => setOpenModal('create')} />
            )}
            {!isError && !isLoading && rooms.length > 0 && (
                <div className="grid grid-cols-4 gap-8 items-start">
                    {rooms.map((room: any) => (
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
                                &nbsp;
                                {room.private && (
                                    <span title="This Room is private">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                )}
                            </p>
                            {room.description && (
                                <p className="text-xs">
                                    {room.description}
                                </p>
                            )}
                            <p className="text-xs">
                                {room.userLimit === null && <span>{room.users} users</span>}
                                {room.userLimit !== null && <span>{room.users} / {room.userLimit} users</span>}
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

            <ModalFormRoom
                isOpen={openModal === 'create'}
                close={() => setOpenModal(null)}
                mode="create"
            />
            <ModalFormRoom
                isOpen={openModal === 'edit' && room.isFetched}
                close={() => setOpenModal(null)}
                mode="edit"
                room={room.data}
            />
            <ModalDeleteRoom
                isOpen={openModal === 'delete'}
                close={() => setOpenModal(null)}
                roomId={roomId}
            />

            <ContextMenu
                id={CONTEXT_MENU_ID}
                animation="slide"
            >
                <Item disabled>
                    Room #{roomId}
                </Item>
                <Separator />
                <Item onClick={() => setOpenModal('edit')}>
                    <FontAwesomeIcon icon={faPencil} />
                    <span className="ml-4">Edit</span>
                </Item>
                <Item onClick={() => setOpenModal('delete')}>
                    <FontAwesomeIcon icon={faTrash} />
                    <span className="ml-4">Delete</span>
                </Item>
            </ContextMenu>
        </>
    )
}
