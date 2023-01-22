import { ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

export default function Content(props: Props) {
    return (
        <div className="bg-white py-12 px-16 rounded shadow-lg border-2 border-primary">
            {props.children}
        </div>
    )
}
