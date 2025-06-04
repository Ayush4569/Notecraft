import { createSlice } from "@reduxjs/toolkit"

interface ImageModal{
    isOpen:boolean
}
const initialState:ImageModal = {
    isOpen:false
}

const ImageModalSlice = createSlice({
    name:"image-modal",
    initialState,
    reducers:{
        onOpen:(state)=>{
            state.isOpen = true
        },
        onClose:(state)=>{
            state.isOpen = false
        },
    }
})

export const {onClose,onOpen} = ImageModalSlice.actions
export default ImageModalSlice.reducer