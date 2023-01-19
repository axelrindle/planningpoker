import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReadyState } from 'react-use-websocket'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket.js'

export default function PageRoom() {
    const { roomId } = useParams()

    const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([])
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://10.231.55.48:3001?room=' + roomId)
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]

    const [userId, setUserId] = useState<string>('')
    const [users, setUsers] = useState<any[]>([])

    function select() {
        sendMessage(JSON.stringify({
            userId,
            event: 'SELECT',
            data: {
                cardId: 1
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
            <div className="flex flex-row items-start gap-4 mb-8">
                <Link
                    to="/"
                    className="bg-primary text-white px-8 py-4 rounded"
                >
                    Leave
                </Link>
                <p
                    className="bg-primary text-white px-8 py-4 rounded cursor-pointer"
                    onClick={() => select()}
                >
                    Select
                </p>
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
