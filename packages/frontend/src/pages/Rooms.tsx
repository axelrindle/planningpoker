import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import EntityListPage, { ModalFunction } from '../components/common/EntityListPage'
import ModalDeleteRoom from '../modals/DeleteRoom'
import ModalFormRoom from '../modals/FormRoom'
import { useRooms } from '../query/room'

export default function PageRooms() {
    const [roomId, setRoomId] = useState(0)

    const getModal: ModalFunction = useCallback(({
        openModal, setOpenModal, query
    }) => (
        <>
            <ModalFormRoom
                isOpen={openModal === 'create'}
                close={() => setOpenModal(null)}
                mode="create"
            />
            <ModalFormRoom
                isOpen={openModal === 'edit' && query.isFetched}
                close={() => setOpenModal(null)}
                mode="edit"
                room={query.data}
            />
            <ModalDeleteRoom
                isOpen={openModal === 'delete'}
                close={() => setOpenModal(null)}
                roomId={roomId}
            />
        </>
    ), [roomId])

    return (
        <EntityListPage
            entity='room'
            title='Rooms'
            subtitle='Select a Room to join down below.'
            query={useRooms()}
            modals={getModal}
        >
            {({ items, contextMenu }) => (
                <div className="grid grid-cols-4 gap-8 items-start">
                    {items.map((room: any) => (
                        <Link
                            key={room.id}
                            to={`/room/${room.id}`}
                            className="bg-primary text-white px-8 py-4 rounded"
                            onContextMenu={event => {
                                setRoomId(room.id)
                                contextMenu.show({
                                    id: contextMenu.id,
                                    event
                                })
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
        </EntityListPage>
    )
}
