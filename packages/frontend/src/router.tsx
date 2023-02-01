import { createBrowserRouter } from 'react-router-dom'
import LayoutMain from './layouts/LayoutMain'
import PageCards from './pages/Cards'
import PageRoom from './pages/Room'
import PageRooms from './pages/Rooms'
import PageUpload from './pages/Upload'

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
            {
                path: '/upload',
                element: <PageUpload />
            }
        ]
    }
])

export default router
