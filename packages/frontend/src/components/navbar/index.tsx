import { faHome, faUpload } from '@fortawesome/free-solid-svg-icons';
import icon from '../../assets/icon.svg';
import NightModeSwitch from '../NightModeSwitch';
import NavItem from './NavItem';

export default function Navbar() {
    return (
        <div className="w-full h-16 bg-primary text-white drop-shadow-md">
            <div className="container max-w-screen-xl h-full mx-auto grid grid-cols-3 items-center">
                <div className="flex flex-row gap-4">
                    <NavItem
                        to="/"
                        icon={faHome}
                        label="Home"
                    />
                    <NavItem
                        to="/upload"
                        icon={faUpload}
                        label="Upload"
                    />
                </div>
                <div className="flex flex-row justify-center items-center gap-4">
                    <img src={icon} alt="poker card" className="h-8" />
                    <span className="font-bold text-2xl">Planning Poker</span>
                </div>
                <div className="flex flex-row justify-end items-center gap-4">
                    <p>
                        You're not signed in.
                    </p>
                    <NightModeSwitch />
                </div>
            </div>
        </div>
    )
}
