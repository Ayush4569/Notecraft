import { configureStore } from "@reduxjs/toolkit"
import sidebarReducer from "./slices/sidebar"
import userReducer from "./slices/user"
import { persistStore, persistReducer } from "redux-persist"
import  storage from "./custom-storage"
import { combineReducers } from "redux"
import searchmenuReducer from "./slices/searchmenu"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sidebar", "search", "user"],
}

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  search: searchmenuReducer,
  user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
