import { configureStore } from "@reduxjs/toolkit"
import sidebarReducer from "./slices/sidebar"
import pageReducer from "./slices/currentpage"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "redux"
import searchmenuReducer from "./slices/searchmenu"
import imagemodal from "./slices/imagemodal"
const persistConfig = {
  key: "root",
  storage
}

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  page: pageReducer,
  search:searchmenuReducer,
  imageModal:imagemodal
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
