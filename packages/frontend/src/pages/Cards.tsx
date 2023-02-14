import { faPencil, faPlus, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Item, Separator, useContextMenu } from 'react-contexify'
import Button from '../components/Button'
import ContextMenu from '../components/ContextMenu'
import Header from '../components/Header'
import ModalCreateCard from '../modals/CreateCard'
import ModalDeleteCard from '../modals/DeleteCard'
import { useCards } from '../query/card'
import { useSelector } from '../store'

type Modal = 'create' | 'edit' | 'delete'

const CONTEXT_MENU_ID = 'context-menu-cards'

export default function PageCards() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    const { isError, isLoading, error, data, refetch } = useCards()
    const rooms: any[] = data ?? []

    const contextMenu = useContextMenu({
        id: CONTEXT_MENU_ID
    })

    const [card, setCard] = useState<any>(null)
    const [openModal, setOpenModal] = useState<Modal|null>(null)

    return (
        <>
            <Header
                title="Cards"
                subtitle="Manage available Cards and Presets."
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

            {rooms.length > 0 && (
                <div className="grid grid-cols-6 gap-4">
                    {rooms.map((el, index) => (
                        <div
                            className="border-2 border-primary p-4"
                            key={index}
                            onContextMenu={event => {
                                setCard(el)
                                contextMenu.show({ event })
                            }}
                        >
                            <p>Name: <u>{el.name}</u></p>
                            <p>Value: <u>{el.value}</u></p>
                            {el.image && (
                                <img
                                    src={`${apiUrl}/uploads/${el.image}`}
                                    alt={`Card Icon for ${el.name}`}
                                    crossOrigin="anonymous"
                                />
                            )}
                            {!el.image && (
                                <p>
                                    No image :(
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {!isError && rooms.length === 0 && (
                <p>
                    No Cards
                </p>
            )}
            {isError && (
                <p className="font-bold text-red-500">
                    {error.message}
                </p>
            )}

            <ModalCreateCard
                isOpen={openModal === 'create'}
                close={() => setOpenModal(null)}
            />

            <ModalDeleteCard
                isOpen={openModal === 'delete'}
                close={() => setOpenModal(null)}
                card={card}
            />

            <ContextMenu
                id={CONTEXT_MENU_ID}
                animation="slide"
            >
                <Item disabled>
                    Card {card?.name}
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
