import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import env from '../../util/env'

interface ConfigState {
    apiUrl: string
    socketUrl: string
    darkModeActive: boolean
    username?: string
}

interface PayloadData {
    key: keyof ConfigState
    value: any
}

//@ts-ignore
const apiUrl = new URL(env('REACT_APP_API_URL'))
const socketUrl = new URL(apiUrl)
socketUrl.port = '' + (parseInt(socketUrl.port) + 1)

const darkModeActive = localStorage.getItem('darkModeActive') === 'true'

export const configSlice = createSlice<ConfigState, SliceCaseReducers<ConfigState>>({
    name: 'config',
    initialState: {
        apiUrl: `${apiUrl.protocol}//${apiUrl.host}`,
        socketUrl: `ws://${socketUrl.host}`,
        darkModeActive,
        username: localStorage.getItem('username') || undefined
    },
    reducers: {
        setConfigValue: (state, action: PayloadAction<PayloadData>) => {
            //@ts-ignore
            state[action.payload.key] = action.payload.value
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
            localStorage.setItem('username', action.payload)
        }
    }
})

export const { setConfigValue, setUsername } = configSlice.actions

export default configSlice.reducer
