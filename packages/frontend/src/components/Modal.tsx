import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Button from '../components/Button'

const container = document.getElementById('modals') as HTMLElement

interface Action {
    label: string
    handle: () => void
    icon: IconProp
}

interface Props {
    isOpen: boolean
    disableClose?: boolean
    close: () => void
    children?: ReactNode
    title: string
    subtitle?: string
    actions: Action[]
}

export interface ChildProps {
    isOpen: boolean
    disableClose?: boolean
    close: () => void
}

export default function Modal(props: Props) {
    if (!props.isOpen) return (<></>)

    const element = (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-overlay">
            <div className="bg-white container max-w-screen-md mx-auto mt-24 p-12 rounded">
                <div className="grid grid-cols-2 items-center">
                    <div>
                        <p className="text-xl font-bold">
                            {props.title}
                        </p>
                        {props.subtitle && (
                            <p className="text-sm">
                                {props.subtitle}
                            </p>
                        )}
                    </div>
                    <div className="justify-self-end">
                        <button
                            className={`
                                w-10 h-10 text-primary cursor-pointer
                                border-primary border-2 rounded-full
                                flex items-center justify-center
                                transition-colors
                                enabled:hover:bg-primary hover:text-white
                                enabled:active:bg-violet-900 active:text-white
                                disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300
                            `}
                            title="Close"
                            onClick={() => {
                                if (!props.disableClose) {
                                    props.close()
                                }
                            }}
                            disabled={props.disableClose}
                        >
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                </div>

                <hr className="my-8" />
                {props.children}
                <hr className="my-8" />

                <div className="flex flex-row items-center justify-end gap-4">
                    {props.actions.map((action, index) => (
                        <Button
                            key={index}
                            label={action.label}
                            onClick={action.handle}
                            icon={action.icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
    return createPortal(element, container)
}