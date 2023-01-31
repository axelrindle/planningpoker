import { ChangeEventHandler, HTMLInputTypeAttribute, ReactNode, useCallback } from 'react'
import { useDispatch, useSelector } from '../../store'
import { mergeFormData } from '../../store/slices/formData'

export interface Props {
    type: HTMLInputTypeAttribute
    name: string
    min?: number
    max?: number
    label: string
    placeholder?: string
    help?: string
    error?: string
    formData?: string
    contentAfter?: ReactNode
    containerClassName?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
}

function useInitialValue(root: string, key: string) {
    const data = useSelector(state => state.formData[root])
    if (!data) {
        return undefined
    }

    return data[key]
}

export default function Input(props: Props) {
    const formDataKey = props.formData ?? 'DUMMY'

    const dispatch = useDispatch()
    const _initialValue = useInitialValue(formDataKey, props.name)
    const _setFormData = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
        dispatch(mergeFormData({
            key: formDataKey,
            value: {
                [props.name]: e.target.value
            }
        }))
    }, [dispatch, formDataKey, props.name])

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
                    "
                    placeholder={props.placeholder}
                    defaultValue={props.formData ? _initialValue : undefined}
                    onChange={props.formData ? _setFormData : props.onChange}
                    min={props.min}
                    max={props.max}
                />
                {props.contentAfter}
            </div>
            {props.error && (
                <span className="text-sm text-red-500">
                    {props.error}
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
