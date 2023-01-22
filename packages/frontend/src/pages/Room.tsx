import { faCheck, faChessRook, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReadyState } from 'react-use-websocket'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket.js'
import Button from '../components/Button'
import { useSelector } from '../store'

export default function PageRoom() {
    const { roomId } = useParams()
    const socketUrl = useSelector(state => state.config.socketUrl)

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
                default:
                    break;
            }
        }
    }, [lastMessage, setMessageHistory])

    return (
        <>
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium" htmlFor="card">
                    Card
                </label>
                <input
                    type="number"
                    name="card"
                    min={0}
                    className="
                        w-36 p-4
                        text-sm shadow-sm
                        border-2 border-violet-200 rounded
                    "
                    onChange={e => setCard(e.target.value)}
                />
            </div>
            <div className="flex flex-row items-start gap-4 mb-8">
                <Link
                    to="/"
                    className="bg-primary text-white px-8 py-4 rounded"
                >
                    Leave
                </Link>
                <Button
                    label="Select"
                    icon={faChessRook}
                    onClick={() => select()}
                />
            </div>

            <div className="mb-8">
                <p>You are: <u>{userId}</u></p>
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

            <div>
                <p>The WebSocket is currently <u>{connectionStatus}</u></p>
                {lastMessage ? <p>Last message: {lastMessage.data}</p> : null}
                <ul className="ml-8 list-disc">
                    {messageHistory.map((message, idx) => (
                        <li key={idx}>{message ? message.data : null}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}
