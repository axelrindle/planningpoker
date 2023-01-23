import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'

interface ConfigState {
    apiUrl: string
    socketUrl: string
    darkModeActive: boolean
}

interface PayloadData {
    key: keyof ConfigState
    value: any
}

//@ts-ignore
const apiUrl = new URL(process.env.REACT_APP_API_URL)
const socketUrl = new URL(apiUrl)
socketUrl.port = '' + (parseInt(socketUrl.port) + 1)

const darkModeActive = localStorage.getItem('darkModeActive') === 'true'

export const configSlice = createSlice<ConfigState, SliceCaseReducers<ConfigState>>({
    name: 'config',
    initialState: {
        apiUrl: `${apiUrl.protocol}//${apiUrl.host}`,
        socketUrl: `ws://${socketUrl.host}`,
        darkModeActive
    },
    reducers: {
        setConfigValue: (state, action: PayloadAction<PayloadData>) => {
            //@ts-ignore
            state[action.payload.key] = action.payload.value
        }
    }
})

export const { setConfigValue } = configSlice.actions

export default configSlice.reducer
