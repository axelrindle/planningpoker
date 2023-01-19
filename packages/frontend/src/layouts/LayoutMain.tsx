import { Outlet } from 'react-router-dom'

export default function LayoutMain() {
    return (
        <div className="w-full h-16 bg-primary text-white drop-shadow-md">
            <div className="w-3/4 h-full m-auto flex flex-row flex-nowrap items-center mb-12">
                <span className="text-2xl">Planning Poker</span>
            </div>

            <div className="w-3/4 m-auto text-black mb-8 flex flex-col">
                <Outlet />
            </div>
        </div>
    )
}
