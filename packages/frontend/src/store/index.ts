import { configureStore } from '@reduxjs/toolkit'
import {
    TypedUseSelectorHook,
    useDispatch as _useDispatch,
    useSelector as _useSelector
} from 'react-redux'
import config from './slices/config'

const store = configureStore({
    reducer: {
        config,
    },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useDispatch: () => AppDispatch = _useDispatch
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector
