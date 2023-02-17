import { UseMutationResult } from '@tanstack/react-query'
import { Formik, FormikContext, FormikContextType, FormikProps } from 'formik'
import { MutableRefObject, ReactNode, useContext, useEffect, useRef } from 'react'
import { FormData, FormError } from '../../types'

export interface FormContext {
    submit: () => void
    reset: () => void
}

interface Props {
    preFill?: any
    mutation: UseMutationResult<Response, FormError, FormData>
    children?: ReactNode
    formRef?: MutableRefObject<FormContext>
}

export function useFormikContext<Values>(): FormikContextType<Values> | undefined {
    return useContext<FormikContextType<Values>>(FormikContext)
}

export function useFormRef() {
    return useRef<FormContext>(null) as MutableRefObject<FormContext>
}

export default function Form(props: Props) {
    const formik = useRef<FormikProps<any>>(null)

    useEffect(() => {
        const ref = props.formRef
        if (ref !== undefined) {
            ref.current = {
                submit() {
                    formik.current?.handleSubmit()
                },
                reset() {
                    formik.current?.handleReset()
                },
            }
        }
    }, [props.formRef])

    return (
        <Formik
            innerRef={formik}
            initialValues={props.preFill ?? {}}
            onSubmit={(values, opts) => {
                opts.setErrors({})
                props.mutation.mutate(values, {
                    onSettled() {
                        opts.setSubmitting(false)
                    },
                    onError(error, _variables, _context) {
                        opts.setErrors(error.details.reduce((a, v) => {
                            return { ...a, [v.param]: v.msg }
                        }, {}))
                    },
                })
            }}
        >
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {props.children}
            </div>
        </Formik>
    )
}
