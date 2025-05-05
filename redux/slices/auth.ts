import { createSlice } from "@reduxjs/toolkit";

interface User {
    username: string,
    email: string
    profileImage?: string
}
interface AuthState {
    user: User | null,
    loading: boolean
}

const initialState: AuthState = {
    user: null,
    loading: false
}
const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action:{type:string,payload:User}) => {
            state.user = action.payload,
                state.loading = false
        },
        logout: (state) => {
            state.user = null,
            state.loading = false
        }
    }
})


export default AuthSlice.reducer

export const {login,logout} = AuthSlice.actions