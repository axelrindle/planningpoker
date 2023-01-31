import { faCheck, faChessRook, faClose, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import Button from '../components/Button'
import Input from '../components/form/Input'
import ModalRoomPassword from '../modals/RoomPassword'
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

    const [card, setCard] = useState('')

    function select() {
        sendMessage(JSON.stringify({
            userId,
            event: 'SELECT',
            data: {
                cardId: card
            }
        }))
    }

    useEffect(() => {
        if (!room) return
        if (room.private) {
            setAskPassword(true)
        }
    }, [room])
    useEffect(() => {
        if (!askPassword && !password) {
            setAskPassword(true)
        }
    }, [askPassword, password, navigate])

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
            <Input
                type="number"
                name="card"
                label="Card"
                min={0}
                onChange={e => setCard(e.target.value)}
            />
            <div className="flex flex-row items-start gap-4 my-8">
                <Button
                    label="Select"
                    icon={faChessRook}
                    onClick={() => select()}
                />
            </div>

            <div className="mb-8 flex flex-row gap-4">
                {users.map((user, index) => (
                    <div className="p-4 bg-secondary" key={index}>
                        <p>
                            {user.name}
                        </p>
                        {user.card && (
                            <p>
                                Card: {user.card}
                            </p>
                        )}
                        <FontAwesomeIcon icon={user.chosen ? faCheck : faClose} />
                    </div>
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
