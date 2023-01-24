import { ChangeEventHandler, HTMLInputTypeAttribute, ReactNode, useCallback } from 'react'
import { useDispatch, useSelector } from '../../store'
import { mergeFormData } from '../../store/slices/formData'

interface Props {
    type: HTMLInputTypeAttribute
    name: string
    label: string
    placeholder?: string
    help?: string
    formData?: string
    contentAfter?: ReactNode
    containerClassName?: string
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
                    onChange={props.formData ? _setFormData : undefined}
                />
                {props.contentAfter}
            </div>
            {props.help && (
                <span className="text-xs text-gray-500">
                    {props.help}
                </span>
            )}
        </div>
    )
}
