import { faCheck, faClose, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import ModalRoomPassword from '../modals/RoomPassword'
import { useCards } from '../query/card'
import { useRoom } from '../query/room'
import { useSelector } from '../store'

export default function PageRoom() {
    const navigate = useNavigate()
    const { roomId } = useParams()
    const socketUrl = useSelector(state => state.config.socketUrl)

    const { isLoading, error, data: room } = useRoom(roomId as string)

    const [askPassword, setAskPassword] = useState(false)
    const [password, setPassword] = useState<string>('')

    // TODO: Authentication using Header not working with browser WebSocket API yet
    // See https://github.com/whatwg/websockets/issues/16
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        `${socketUrl}?room=${roomId}`,
        {},
        room !== undefined && (!room.private || password !== '')
    )
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]

    const [userId, setUserId] = useState<string>('')
    const [users, setUsers] = useState<any[]>([])

    const apiUrl = useSelector(state => state.config.apiUrl)
    const { data: _cards } = useCards()
    const cards = _cards ?? []

    const [selectedCard, setCard] = useState('')

    function select(card: any) {
        setCard(card.id)
        sendMessage(JSON.stringify({
            userId,
            event: 'SELECT',
            data: {
                cardId: card.value
            }
        }))
    }
    function deselect() {
        select({
            id: -1,
            value: undefined
        })
    }

    useEffect(() => {
        if (!room) return
        if (room.private) {
            setAskPassword(true)
        }
    }, [room])
    useEffect(() => {
        if (!room) return
        if (!room.private) return
        if (!askPassword && !password) {
            setAskPassword(true)
        }
    }, [room, askPassword, password, navigate])

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data)
            switch (data.event) {
                case 'HELLO':
                    setUserId(data.data.userId)
                    break;
                case 'UPDATE':
                    setUsers(data.data.users)
                    break
                case 'DELETE':
                    alert('This room has been deleted. You\'re being sent back to the room list.')
                    navigate('/')
                    break
                default:
                    break;
            }
        }
    }, [lastMessage, navigate])

    if (isLoading) {
        return (
            <p className="font-bold">
                Loading...
            </p>
        )
    }

    if (error) {
        return (
            <p className="font-bold text-red-500">
                Something went wrong: {error.message}
            </p>
        )
    }

    return (
        <>
            <div className="flex flex-row">
                <div className="flex-1">
                    <p className="font-bold text-lg">
                        {room.name}
                    </p>
                    <p className="text-sm">
                        {room.description}
                    </p>
                </div>
                <div className="flex flex-row items-center gap-8">
                    <div>
                        <p>
                            Connection: <u>{connectionStatus}</u>
                        </p>
                        <p>
                            You are: <u>{userId}</u>
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="bg-primary text-white px-8 py-4 rounded"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <span className="ml-2">
                            Leave
                        </span>
                    </Link>
                </div>
            </div>
            <hr className="my-4" />

            <div className="mb-8 flex flex-row gap-4">
                {users.map((user, index) => (
                    <div className="p-4 bg-secondary" key={index}>
                        <p>
                            {user.name}
                        </p>
                        {user.card !== undefined && (
                            <p>
                                Card: {user.card}
                            </p>
                        )}
                        <FontAwesomeIcon icon={user.chosen ? faCheck : faClose} />
                    </div>
                ))}
            </div>

            <div className="flex flex-row gap-4">
                {cards.map(card => (
                    <img
                        key={card.id}
                        src={`${apiUrl}/uploads/${card.image}`}
                        alt={`Card Icon for ${card.name}`}
                        crossOrigin="anonymous"
                        className={`
                            w-16 cursor-pointer transition-transform
                            ${selectedCard === card.id ? '-translate-y-2' : 'hover:-translate-y-2'}
                        `}
                        onClick={() => {
                            if (selectedCard === card.id) {
                                deselect()
                            } else {
                                select(card)
                            }
                        }}
                    />
                ))}
            </div>

            <ModalRoomPassword
                isOpen={askPassword}
                roomId={roomId || '0'}
                close={() => setAskPassword(false)}
                cancel={() => navigate('/')}
                onChange={e => setPassword(e.target.value)}
            />

            {/* <div>
                <p>The WebSocket is currently <u>{connectionStatus}</u></p>
                {lastMessage ? <p>Last message: {lastMessage.data}</p> : null}
                <ul className="ml-8 list-disc">
                    {messageHistory.map((message, idx) => (
                        <li key={idx}>{message ? message.data : null}</li>
                    ))}
                </ul>
            </div> */}
        </>
    )
}
