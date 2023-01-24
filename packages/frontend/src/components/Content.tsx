import { ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

export default function Content(props: Props) {
    return (
        <div
            className="
                bg-white border-2 border-primary
                py-12 px-16 rounded shadow-lg
                dark:text-white dark:bg-gray-800
            "
        >
            {props.children}
        </div>
    )
}
