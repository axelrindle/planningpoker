import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Input, { Props as InputProps } from './Input'

interface Props extends Omit<InputProps, 'type'|'contentAfter'> {}

export default function InputPassword(props: Props) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Input
            type={showPassword ? 'text' : 'password'}
            name={props.name}
            label={props.label}
            help={props.help}
            formData={props.formData}
            error={props.error}
            onChange={props.onChange}
            contentAfter={(
                <div
                    className="flex justify-center items-center w-8"
                    title="Toggle password visibility"
                >
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xl text-primary cursor-pointer dark:text-white"
                    />
                </div>
            )}
        />
    )
}
