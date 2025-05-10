import { configureStore } from "@reduxjs/toolkit"
import sidebarReducer from "./slices/sidebar"
import themeReducer from "./slices/theme"
import pageReducer from "./slices/currentpage"
import { TypedUseSelectorHook, useSelector } from "react-redux"
export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        theme: themeReducer,
        page: pageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector