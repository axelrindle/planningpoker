import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useSelector } from '../store'

const htmlElement = document.querySelector('html')

export default function NightModeSwitch() {
    const darkModeActive = useSelector(state => state.config.darkModeActive)
    const [checked, setChecked] = useState(darkModeActive)

    useEffect(() => {
        localStorage.setItem('darkModeActive', `${checked}`)
        checked
            ? htmlElement?.classList.add('dark')
            : htmlElement?.classList.remove('dark')
    }, [checked])

    return (
        <div className="flex flex-row items-center gap-2">
            <label
                className="relative h-8 cursor-pointer w-14"
                htmlFor="nightModeSwitch"
            >
                <input
                    type="checkbox"
                    id="nightModeSwitch"
                    className="sr-only peer"
                    defaultChecked={checked}
                    onChange={e => setChecked(e.target.checked)}
                />

                <span
                    className="
                        absolute inset-0 transition
                        bg-primary rounded-full border-2 border-white
                    "
                />

                <span
                    className="
                        absolute inset-0 transition-all
                        m-1 h-6 w-6 rounded-full
                        bg-gray-300
                        ring-[6px] ring-inset ring-white
                        peer-checked:translate-x-6
                    "
                />
            </label>
            <FontAwesomeIcon
                icon={checked ? faMoon : faSun}
                className="w-4"
                size="2x"
            />
        </div>
    )
}
