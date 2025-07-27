import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    isPro: boolean;
    subscription: {
        status: string | null; 
    }
    status: 'loading' | 'authenticated' | 'unauthenticated'
}
const initialState: InitialState = {
    id: "",
    name: "",
    email: "",
    profileImage: "",
    isPro: false,
    subscription: {
        status: null
    },
    status: 'unauthenticated'
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<InitialState>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.profileImage = action.payload.profileImage;
            state.isPro = action.payload.isPro ;
            state.status = action.payload.status || 'authenticated';
            state.subscription = {
                status: action.payload.subscription?.status || null
            }
        },
        clearUser: (state) => {
            state.id = "";
            state.name = "";
            state.email = "";
            state.profileImage = "";
            state.isPro = false;
            state.status ='unauthenticated';
            state.subscription = {
                status: null
            }
        },
        setLoading: (state) => {
            state.status = 'loading';
        }
    },
})

export const { setUser, clearUser,setLoading } = userSlice.actions;
export default userSlice.reducer;