import { Outlet } from 'react-router-dom'
import Content from '../components/Content'
import Navbar from '../components/navbar'

export default function LayoutMain() {
    return (
        <>
            <Navbar />

            <div
                className="
                    mb-8 mt-12
                    container max-w-screen-xl mx-auto
                    flex flex-col
                "
            >
                <Content border>
                    <Outlet />
                </Content>
            </div>
        </>
    )
}
