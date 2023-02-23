import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface Props {
    label: string
    icon: IconProp
}

export default function Button(props: Props) {
    return (
        <div
            style={{
                borderWidth: '2px',
                borderColor: 'var(--ifm-menu-color-active)',
                borderStyle: 'solid',
                borderRadius: '4px',
                color: '#ffffff',
                padding: '0.25rem 0.75rem',
                margin: '0 0.2rem',
                display: 'inline-block'
            }}>
            <FontAwesomeIcon icon={props.icon} />
            <span
                style={{
                    marginLeft: '8px'
                }}
            >
                {props.label}
            </span>
        </div>
    )
}
