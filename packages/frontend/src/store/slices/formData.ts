import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { useSelector } from '..'

export type FormData = Record<string, any>
export type State = Record<string, FormData>

export interface PayloadData {
    key: string
    value: FormData
}

export const formDataSlice = createSlice<State, SliceCaseReducers<State>>({
    name: 'formData',
    initialState: {},
    reducers: {
        setFormData: (state, action: PayloadAction<PayloadData>) => {
            state[action.payload.key] = action.payload.value
        },
        mergeFormData: (state, action: PayloadAction<PayloadData>) => {
            const original = state[action.payload.key] ?? {}
            const theNew = Object.assign(original, action.payload.value)
            state[action.payload.key] = theNew
        },
        clearFormData: (state, action: PayloadAction<string>) => {
            delete state[action.payload]
        }
    }
})

export const { setFormData, mergeFormData, clearFormData } = formDataSlice.actions

export default formDataSlice.reducer

export function useFormData(key: string): FormData {
    const data = useSelector(state => state.formData[key])
    return data ?? {}
}
