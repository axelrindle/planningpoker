import { Outlet } from 'react-router-dom'
import Content from '../components/Content'
import Navbar from '../components/navbar'

export default function LayoutMain() {
    return (
        <>
            <Navbar />

            <div className="mt-12 container max-w-screen-xl mx-auto text-black mb-8 flex flex-col">
                <Content>
                    <Outlet />
                </Content>
            </div>
        </>
    )
}
