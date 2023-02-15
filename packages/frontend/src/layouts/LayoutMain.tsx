import { Outlet } from 'react-router-dom'
import Content from '../components/layout/Content'
import Footer from '../components/layout/Footer'
import Navbar from '../components/navbar'

export default function LayoutMain() {
    return (
        <>
            <Navbar />

            <div
                className="
                    container max-w-screen-xl
                    mx-auto py-12
                    flex-1 flex flex-col
                "
            >
                <Content border>
                    <Outlet />
                </Content>
            </div>

            <Footer />
        </>
    )
}
