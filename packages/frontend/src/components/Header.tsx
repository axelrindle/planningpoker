import { ReactNode } from 'react'

interface Props {
    title: string
    subtitle?: String
    children?: ReactNode
}

export default function Header(props: Props) {
    return (
        <div className="grid grid-cols-header items-center pb-4 mb-8 border-b-2 border-black dark:border-gray-300">
            <div>
                <p className="font-bold text-lg">
                    {props.title}
                </p>
                {props.subtitle && (
                    <p>{props.subtitle}</p>
                )}
            </div>
            {props.children && (
                <div className="flex flex-row gap-4">
                    {props.children}
                </div>
            )}
        </div>
    )
}
