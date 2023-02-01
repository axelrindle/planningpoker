import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Button from '../components/Button'
import Header from '../components/Header'
import ModalCreateCard from '../modals/CreateCard'
import { useCards } from '../query/card'
import { useSelector } from '../store'

type Modal = 'create'

export default function PageCards() {
    const apiUrl = useSelector(state => state.config.apiUrl)
    const { isError, isLoading, error, data, refetch } = useCards()
    const rooms: any[] = data ?? []

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
                        <div className="border-2 border-primary p-4" key={index}>
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
            {rooms.length === 0 && (
                <p>
                    No Cards
                </p>
            )}

            <ModalCreateCard
                isOpen={openModal === 'create'}
                close={() => setOpenModal(null)}
            />
        </>
    )
}
