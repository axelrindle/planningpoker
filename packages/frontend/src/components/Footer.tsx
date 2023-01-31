import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'

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

export default function Footer() {
    return (
        <div className="w-full py-6 bg-primary drop-shadow-md text-white text-sm">
            <div className="container max-w-screen-xl mx-auto text-center">
                <p className="mb-2">
                    <Link href="https://github.com/axelrindle/planningpoker">Planning Poker</Link> made with <FontAwesomeIcon icon={faHeart} className="text-red-500" /> by <Link href="https://github.com/axelrindle">Axel Rindle</Link>
                </p>
                <p>
                    Illustrations by <Link href="https://undraw.co/illustrations">Katerina Limpitsouni</Link>
                </p>
            </div>
        </div>
    )
}
