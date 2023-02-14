import { Menu, MenuProps } from 'react-contexify'
import { useSelector } from '../store'

interface Props extends Omit<MenuProps, 'theme'> {}

export default function ContextMenu(props: Props) {
    const darkModeActive = useSelector(state => state.config.darkModeActive)

    return (
        <Menu
            {...props}
            theme={darkModeActive ? 'light' : 'dark'}
        />
    )
}
