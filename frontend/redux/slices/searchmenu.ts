import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
    isOpen:boolean
}

const initialState:initialStateType = {
    isOpen:false
}
const SearchMenuSlice = createSlice({
    name:"search",
    initialState,
    reducers:{
        onOpen:(state)=>{
            state.isOpen = true
        },
        onClose:(state)=>{
            state.isOpen = false
        },
        toggle:(state)=>{
            state.isOpen = !state.isOpen
        },
    }
})

export const {onClose,onOpen,toggle} = SearchMenuSlice.actions
export default SearchMenuSlice.reducer