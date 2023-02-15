import { UseMutationResult } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useDispatch } from '../../store'
import { clearFormData, FormData, setFormData } from '../../store/slices/formData'
import { FormError } from '../../util/error'

interface Props {
    name: string
    mutation: UseMutationResult<Response, FormError, FormData>
    preFill?: any
    children?: ReactNode
}

interface FormContextData {
    key: string
    mutation: UseMutationResult<Response, FormError, FormData>
}

//@ts-ignore
export const FormContext = createContext<FormContextData>()

export function useForm() {
    return useContext(FormContext)
}

export default function Form(props: Props) {
    const context: FormContextData = useMemo(
        () => ({
            key: props.name,
            mutation: props.mutation
        }),
        [props.mutation, props.name]
    )

    const dispatch = useDispatch()

    useEffect(() => {
        if (props.preFill !== undefined) {
            dispatch(setFormData({
                key: props.name,
                value: props.preFill
            }))
        }

        return () => {
            dispatch(clearFormData(props.name))
        }
    }, [dispatch, props.name, props.preFill])

    return (
        <FormContext.Provider value={context}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {props.children}
            </div>
        </FormContext.Provider>
    )
}
