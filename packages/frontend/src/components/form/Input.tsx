import { ChangeEventHandler, HTMLInputTypeAttribute, ReactNode, useMemo } from 'react'
import { FormData } from '../../types'
import { useFormikContext } from './Form'

export interface Props {
    type: HTMLInputTypeAttribute
    name: string
    min?: number
    max?: number
    label: string
    placeholder?: string
    help?: string
    error?: string
    contentAfter?: ReactNode
    containerClassName?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
    defaultValue?: string
    disabled?: boolean
}

export default function Input(props: Props) {
    const context = useFormikContext<FormData>()
    const error = useMemo(
        () => context ? context.errors[props.name] as string : props.error,
        [context, props.error, props.name]
    )

    return (
        <div className={`flex flex-col gap-1 ${props.containerClassName ?? ''}`}>
            <label className="text-sm font-medium" htmlFor={props.name}>
                {props.label}
            </label>
            <div className="flex flex-row gap-4">
                <input
                    type={props.type}
                    name={props.name}
                    className="
                        w-full p-4
                        text-black text-sm shadow-sm
                        border-2 border-violet-200 rounded
                        disabled:cursor-not-allowed
                    "
                    placeholder={props.placeholder}
                    value={context ? (context.values[props.name] ?? '') : undefined}
                    defaultValue={context ? undefined : props.defaultValue}
                    onChange={context ? context.handleChange : props.onChange}
                    onBlur={context ? context.handleBlur : undefined}
                    min={props.min}
                    max={props.max}
                    disabled={props.disabled}
                />
                {props.contentAfter}
            </div>
            {!props.disabled && error && (
                <span className="text-sm text-red-500">
                    {error}
                </span>
            )}
            {props.help && (
                <span className="text-xs text-gray-500">
                    {props.help}
                </span>
            )}
        </div>
    )
}
