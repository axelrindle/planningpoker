import { createBrowserRouter } from 'react-router-dom'
import LayoutMain from './layouts/LayoutMain'
import PageRoom from './pages/Room'
import PageRooms from './pages/Rooms'

const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutMain />,
        children: [
            {
                index: true,
                element: <PageRooms />
            },
            {
                path: '/room/:roomId',
                element: <PageRoom />
            }
        ]
    }
])

export default router
