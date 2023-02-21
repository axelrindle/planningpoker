import { useCallback, useState } from 'react'
import EntityListPage, { ModalFunction } from '../components/common/EntityListPage'
import ModalCreateCard from '../modals/CreateCard'
import ModalDeleteCard from '../modals/DeleteCard'
import ModalEditCard from '../modals/EditCard'
import { useCards } from '../query/card'
import { useSelector } from '../store'

export default function PageCards() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    const [card, setCard] = useState<any>(null)

    const getModal: ModalFunction = useCallback(({
        openModal, setOpenModal, query
    }) => (
        <>
            <ModalCreateCard
                isOpen={openModal === 'create'}
                close={() => setOpenModal(null)}
            />
            <ModalEditCard
                isOpen={openModal === 'edit'}
                close={() => setOpenModal(null)}
                card={card}
            />
            <ModalDeleteCard
                isOpen={openModal === 'delete'}
                close={() => setOpenModal(null)}
                card={card}
            />
        </>
    ), [card])

    return (
        <EntityListPage
            entity='card'
            title='Cards'
            subtitle='Manage available Cards and Presets.'
            query={useCards()}
            modals={getModal}
        >
            {({ items, contextMenu }) => (
                <div className="grid grid-cols-6 gap-4">
                    {items.map((el, index) => (
                        <div
                            className="border-2 border-primary p-4"
                            key={index}
                            onContextMenu={event => {
                                setCard(el)
                                contextMenu.show({
                                    id: contextMenu.id,
                                    event
                                })
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
        </EntityListPage>
    )
}
