import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, To } from 'react-router-dom';

interface Props {
    to: To
    icon: IconProp
    label: string
}

export default function NavItem(props: Props) {
    return (
        <NavLink
            to={props.to}
            title={props.label}
            className={({ isActive }) => `
                px-4 py-2 rounded transition-colors
                hover:bg-white hover:text-primary
                ${isActive ? 'border-b-2' : ''}
            `}
        >
            <FontAwesomeIcon icon={props.icon} />

            {/* {props.label && (
                <span className="ml-2">
                    {props.label}
                </span>
            )} */}
        </NavLink>
    )
}
