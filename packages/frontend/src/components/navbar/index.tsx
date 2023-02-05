import { faHome, faScroll } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import icon from '../../assets/icon.svg'
import ModalUsername from '../../modals/Username'
import { useSelector } from '../../store'
import NightModeSwitch from '../NightModeSwitch'
import NavItem from './NavItem'

type Modal = 'username'

export default function Navbar() {
    const [openModal, setOpenModal] = useState<Modal|null>(null)
    const username = useSelector(state => state.config.username)

    return (
        <>
            <div className="w-full h-16 bg-primary text-white drop-shadow-md">
                <div className="container max-w-screen-xl h-inherit mx-auto grid grid-cols-3 items-center">
                    <div className="flex flex-row gap-4">
                        <NavItem
                            to="/"
                            icon={faHome}
                            label="Home"
                        />
                        <NavItem
                            to="/card"
                            icon={faScroll}
                            label="Cards"
                        />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-4">
                        <img src={icon} alt="poker card" className="h-8" />
                        <span className="font-bold text-2xl">Planning Poker</span>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-4">
                        <p
                            className="font-medium underline cursor-pointer"
                            onClick={() => setOpenModal('username')}
                        >
                            {username ? 'Hi there, ' + username : 'Who are you?'}
                        </p>
                        <NightModeSwitch />
                    </div>
                </div>
            </div>

            <ModalUsername
                isOpen={openModal === 'username'}
                close={() => setOpenModal(null)}
            />
        </>
    )
}
