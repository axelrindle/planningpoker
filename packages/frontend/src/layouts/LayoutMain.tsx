import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Outlet } from 'react-router-dom'

export default function LayoutMain() {
    return (
        <div className="w-full h-16 bg-primary text-white drop-shadow-md">
            <div className="w-3/4 h-full m-auto grid grid-cols-header items-center mb-12">
                <Link to="/">
                    <span className="font-bold text-2xl">Planning Poker</span>
                </Link>
                <div>
                    <Link to="/upload">
                        <FontAwesomeIcon icon={faUpload} />
                        <span className="ml-2">
                            Upload
                        </span>
                    </Link>
                </div>
            </div>

            <div className="w-3/4 m-auto text-black mb-8 flex flex-col">
                <Outlet />
            </div>
        </div>
    )
}
