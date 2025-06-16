import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface CoverImage {
    imageurl: string | null;
}
const initialState: CoverImage = {
    imageurl: null,
}
const CoverImageSlice = createSlice({
    name:"cover-image",
    initialState,
    reducers: {
        setImage: (state, action:PayloadAction<string | null>) => {
            state.imageurl = action.payload;
        }
    },
})
export const { setImage } = CoverImageSlice.actions;
export default CoverImageSlice.reducer;