import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Outlet } from 'react-router-dom'
import icon from '../assets/icon.svg'

export default function LayoutMain() {
    return (
        <div className="w-full h-16 bg-primary text-white drop-shadow-md">
            <div className="container max-w-screen-xl h-full mx-auto grid grid-cols-3 items-center mb-12">
                <div>
                    <Link to="/upload">
                        <FontAwesomeIcon icon={faUpload} />
                        <span className="ml-2">
                            Upload
                        </span>
                    </Link>
                </div>
                <div className="flex justify-center">
                    <Link to="/" className="flex flex-row gap-4 items-center">
                        <img src={icon} alt="poker card" className="h-8" />
                        <span className="font-bold text-2xl">Planning Poker</span>
                    </Link>
                </div>
                <div className="flex justify-end">
                    <p>
                        You're not signed in.
                    </p>
                </div>
            </div>

            <div className="container max-w-screen-xl mx-auto text-black mb-8 flex flex-col">
                <Outlet />
            </div>
        </div>
    )
}
