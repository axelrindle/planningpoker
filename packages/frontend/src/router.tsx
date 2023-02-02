import { createBrowserRouter } from 'react-router-dom'
import LayoutMain from './layouts/LayoutMain'
import PageCards from './pages/Cards'
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
            },
            {
                path:'/card',
                element: <PageCards />
            },
        ]
    }
])

export default router
