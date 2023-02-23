import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBookAtlas, faClose, faImage, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useFormRef } from '../components/form/Form';
import Modal, { Action, ChildProps } from '../components/Modal';
import { updateCard } from '../query/card';
import { useSelector } from '../store';
import { FormData, FormError } from '../types';
import { FormCard } from './CreateCard';
import construction from '../assets/illustrations/undraw_under_construction_-46-pa.svg'

interface Tab {
    key: string
    label: string
    icon: IconProp
}

const tabs: Tab[] = [
    {
        key: 'form',
        label: 'Data',
        icon: faBookAtlas,
    },
    {
        key: 'image',
        label: 'Image',
        icon: faImage,
    }
]
const tabNames: string[] = tabs.map(tab => tab.key)
type TabType = typeof tabNames[number]

interface Props extends ChildProps {
    card: any
}

interface PropsTabs {
    onClick: (tab: Tab) => void
    openTab: TabType
}

function Tabs(props: PropsTabs) {
    const isOpen = useCallback((tab: Tab) => {
        return tab.key === props.openTab
    }, [props.openTab])

    return (
        <ul className="grid grid-rows-1 grid-flow-col">
            {tabs.map(tab => (
                <li
                    className={`
                        relative block p-4
                        hover:bg-gray-700
                        cursor-pointer transition-colors
                        ${isOpen(tab) ? 'bg-gray-700 text-gray-200' : 'text-gray-500'}
                    `}
                    key={tab.key}
                    onClick={() => props.onClick(tab)}
                >
                    <span className={`
                        inset-x-0 -bottom-px w-full absolute
                        ${isOpen(tab) ? 'bg-primary h-1' : 'bg-gray-700 h-[2px]'}
                    `}/>
                    <div className="flex items-center justify-center gap-4">
                        <FontAwesomeIcon icon={tab.icon} />
                        <span className="text-sm font-medium">
                            {tab.label}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default function ModalEditCard(props: Props) {
    const [openTab, setOpenTab] = useState<TabType>('form')

    const apiUrl = useSelector(state => state.config.apiUrl)
    const formRef = useFormRef()

    const queryClient = useQueryClient()
    const mutationUpdate = useMutation<Response, FormError, FormData>({
        mutationFn: updateCard(apiUrl, props.card?.id),
        onSuccess: (_res, _v, _c) => {
            queryClient.invalidateQueries({
                queryKey: ['cards']
            })
            props.close()
        }
    })

    const actions = useMemo<Action[]>(() => {
        switch (openTab) {
            case 'form':
                return [
                    {
                        label: 'Close',
                        icon: faClose,
                        handle: props.close,
                    },
                    {
                        label: 'Save',
                        icon: faSave,
                        handle() {
                            formRef.current?.submit()
                        },
                    },
                ]
            case 'image':
                return [
                    {
                        label: 'Close',
                        icon: faClose,
                        handle: props.close,
                    },
                    /*{
                        label: 'Upload',
                        icon: faUpload,
                        handle() {},
                    },*/
                ]
            default:
                throw new Error('Invalid tab type ' + openTab)
        }
    }, [formRef, openTab, props.close])

    return (
        <Modal
            {...props}
            title={`Edit Card #${props.card?.id} ("${props.card?.name}")`}
            actions={actions}
        >
            <Tabs
                openTab={openTab}
                onClick={tab => setOpenTab(tab.key)}
            />

            <div className="mt-8">
                {openTab !== 'form' ? null : (
                    <FormCard
                        mutation={mutationUpdate}
                        formRef={formRef}
                        preFill={props.card}
                    />
                )}
                {openTab !== 'image' ? null : (
                    <div className="flex flex-col gap-8 items-center">
                        <img src={construction} className="w-96" alt="Under Construction" />
                        <p className="font-medium">
                            This feature is under construction.
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    )
}
