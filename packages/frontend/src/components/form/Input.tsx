import { ChangeEventHandler, HTMLInputTypeAttribute, ReactNode, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from '../../store'
import { mergeFormData } from '../../store/slices/formData'
import { getError } from '../../util/error'
import { useForm } from './Form'

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

export function useFormDataKey(): string {
    const context = useForm()
    return context?.key ?? 'DUMMY'
}

function useInitialValue(root: string, props: Props) {
    const defaultValue =  props.defaultValue || ''
    const data = useSelector(state => state.formData[root])
    if (!data) {
        return defaultValue
    }

    return data[props.name] || defaultValue
}

function transformValue(value: any) {
    switch (typeof value) {
        case 'undefined':
            return undefined
        case 'number':
            return value ? value : 0
        default:
            return value ? value : null
    }
}

export default function Input(props: Props) {
    const context = useForm()
    const formDataKey = useFormDataKey()

    const dispatch = useDispatch()
    const initialValue = useInitialValue(formDataKey, props)
    const error = context?.mutation ? getError(context.mutation, props.name) : props.error

    const [value, setValue] = useState(initialValue)

    const persist = useCallback<(value: any) => void>(value => {
        dispatch(mergeFormData({
            key: formDataKey,
            value: {
                [props.name]: transformValue(value)
            }
        }))
    }, [dispatch, formDataKey, props.name])

    useEffect(() => {
        persist(value)
    }, [persist, value])

    useEffect(() => {
        if (props.disabled) {
            setValue('')
        }
        else {
            setValue(initialValue)
        }
    }, [initialValue, props.disabled])

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
                    onChange={e => {
                        if (props.onChange !== undefined) {
                            props.onChange(e)
                        }
                        else {
                            setValue(e.target.value)
                        }
                    }}
                    value={props.onChange ? undefined : value}
                    defaultValue={props.onChange ? props.defaultValue : undefined}
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
