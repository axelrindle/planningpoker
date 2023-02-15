import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MouseEventHandler, useMemo } from 'react'

interface Props {
    label?: string | (() => string)
    icon?: IconProp
    onClick?: MouseEventHandler
    hideLabel?: boolean
    disabled?: boolean
}

export default function Button(props: Props) {
    const { label } = props

    const theLabel = useMemo(
        () => typeof label === 'function' ? label() : label,
        [label]
    )

    return (
        <button
            className="
                px-4 py-2
                text-primary cursor-pointer
                border-primary border-2 rounded
                flex items-center justify-center
                transition-colors
                enabled:hover:bg-primary hover:text-white
                enabled:active:bg-violet-900 active:text-white
                disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300
                dark:text-white
            "
            onClick={event => {
                if (!props.disabled) {
                    props.onClick?.(event)
                }
            }}
            title={theLabel}
            disabled={props.disabled}
        >
            {props.icon && <FontAwesomeIcon icon={props.icon} />}
            {!props.hideLabel && props.label && (
                <span className="ml-2">
                    {theLabel}
                </span>
            )}
        </button>
    )
}
