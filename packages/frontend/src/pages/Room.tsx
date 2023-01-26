import { faCheck, faChessRook, faClose, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ReadyState } from 'react-use-websocket'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket.js'
import Button from '../components/Button'
import Input from '../components/form/Input'
import { useRoom } from '../query/room'
import { useSelector } from '../store'

export default function PageRoom() {
    const navigate = useNavigate()
    const { roomId } = useParams()
    const socketUrl = useSelector(state => state.config.socketUrl)

    const { isLoading, error, data: room, refetch } = useRoom(roomId as string)

    const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([])
    const { sendMessage, lastMessage, readyState } = useWebSocket(`${socketUrl}?room=${roomId}`)
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
        if (lastMessage !== null) {
            setMessageHistory(prev => prev.concat(lastMessage))

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
    }, [lastMessage, setMessageHistory, navigate])

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
