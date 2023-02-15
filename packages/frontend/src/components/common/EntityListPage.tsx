import { faPencil, faPlus, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UseQueryResult } from '@tanstack/react-query'
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import { Item, Separator, useContextMenu } from 'react-contexify'
import Button from '../Button'
import ContextMenu from '../ContextMenu'
import Header from '../layout/Header'
import NothingFound from '../NothingFound'

export type Modal = 'create' | 'edit' | 'delete' | null

interface Props {
    entity: string
    title: string
    subtitle?: string
    query: UseQueryResult<any, any>
    children: ChildrenFunction
    modals: ModalFunction
}

interface ChildrenFunctionContext {
    items: any[]
    contextMenu: ReturnType<typeof useContextMenu> & {
        id: string
    }
}

interface ModalFunctionContext {
    openModal: Modal
    setOpenModal: Dispatch<SetStateAction<Modal>>
    query: Props['query']
}

export type ChildrenFunction = (context: ChildrenFunctionContext) => ReactNode
export type ModalFunction = (context: ModalFunctionContext) => ReactNode

export default function EntityListPage(props: Props) {
    const { entity, query, modals } = props

    const contextMenuId = `context-menu-${entity}`
    const contextMenu = useContextMenu({
        id: contextMenuId
    })

    const [openModal, setOpenModal] = useState<Modal>(null)

    const { isError, isLoading, error, data, refetch } = query
    const items = useMemo(
        () => data ?? [],
        [data]
    )

    const showEmpty = useMemo(
        () => !isError && !isLoading && items.length === 0,
        [isError, isLoading, items.length]
    )
    const showData = useMemo(
        () => !isError && !isLoading && items.length > 0,
        [isError, isLoading, items.length]
    )
    const showError = useMemo(
        () => isError,
        [isError]
    )

    return (
        <>
            <Header
                title={props.title}
                subtitle={props.subtitle}
            >
                <Button
                    label='Refresh'
                    icon={faRefresh}
                    onClick={() => refetch()}
                    hideLabel
                    disabled={isLoading}
                />
                <Button
                    label='Add'
                    icon={faPlus}
                    onClick={() => setOpenModal('create')}
                />
            </Header>

            {!showEmpty ? null : (
                <NothingFound
                    entity={props.title}
                    add={() => setOpenModal('create')}
                />
            )}
            {!showData ? null : props.children({
                items, contextMenu: {
                    id: contextMenuId,
                    ...contextMenu
                }
            })}
            {!showError ? null : (
                <p className="font-bold text-red-500">
                    Error: {error.message}
                </p>
            )}

            {modals({ openModal, setOpenModal, query })}

            <ContextMenu
                id={contextMenuId}
                animation="slide"
            >
                <Item disabled>
                    {props.title} Actions
                </Item>
                <Separator />
                <Item onClick={() => setOpenModal('edit')}>
                    <FontAwesomeIcon icon={faPencil} />
                    <span className="ml-4">
                        Edit
                    </span>
                </Item>
                <Item onClick={() => setOpenModal('delete')}>
                    <FontAwesomeIcon icon={faTrash} />
                    <span className="ml-4">
                        Delete
                    </span>
                </Item>
            </ContextMenu>
        </>
    )
}
