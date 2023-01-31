import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Content from '../components/Content'
import Navbar from '../components/navbar'

interface LinkProps {
    href: string
    children: ReactNode
}

function Link(props: LinkProps) {
    return (
        <a
            href={props.href}
            className="underline"
        >
            {props.children}
        </a>
    )
}

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

            <div className="w-full h-16 bg-primary text-white drop-shadow-md">
                <div className="container max-w-screen-xl h-full mx-auto flex items-center justify-center">
                    <p>
                        <Link href="https://github.com/axelrindle/planningpoker">Planning Poker</Link> made with <FontAwesomeIcon icon={faHeart} /> by <Link href="https://github.com/axelrindle">Axel Rindle</Link>
                    </p>
                </div>
            </div>
        </>
    )
}
