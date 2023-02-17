import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useField } from 'formik'
import { useEffect, useState } from 'react'
import Input, { Props as InputProps } from './Input'

interface Props extends Omit<InputProps, 'contentAfter'> {}

export default function InputToggleable(props: Props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_field, meta, helpers] = useField(props.name)
    const { setValue } = helpers

    const [enabled, setEnabled] = useState(!props.disabled)

    useEffect(() => {
        if (enabled) {
            setValue(meta.initialValue)
        }
        else {
            setValue(null)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled])

    return (
        <Input
            {...props}
            disabled={!enabled}
            contentAfter={(
                <div
                    className="flex justify-center items-center w-8"
                    title="Toggle password visibility"
                >
                    <FontAwesomeIcon
                        icon={enabled ? faSquareCheck : faSquare}
                        onClick={() => setEnabled(!enabled)}
                        className="text-xl text-primary cursor-pointer dark:text-white"
                    />
                </div>
            )}
        />
    )
}
