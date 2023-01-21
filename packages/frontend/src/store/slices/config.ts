import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'

export interface ConfigState {
    apiUrl: string
    socketUrl: string
}

export interface PayloadData {
    key: keyof ConfigState
    value: any
}

//@ts-ignore
const apiUrl = new URL(process.env.REACT_APP_API_URL)
const socketUrl = new URL(apiUrl)
socketUrl.port = '' + (parseInt(socketUrl.port) + 1)

export const configSlice = createSlice<ConfigState, SliceCaseReducers<ConfigState>>({
    name: 'config',
    initialState: {
        apiUrl: `${apiUrl.protocol}//${apiUrl.host}`,
        socketUrl: `ws://${socketUrl.host}`,
    },
    reducers: {
        setConfigValue: (state, action: PayloadAction<PayloadData>) => {
            state[action.payload.key] = action.payload.value
        }
    }
})

export const { setConfigValue } = configSlice.actions

export default configSlice.reducer
