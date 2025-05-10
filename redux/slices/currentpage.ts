import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface CurrentPage {
    pagename: string | null,
    pageId: string | number | null
}

const initialState: CurrentPage = {
    pageId: null,
    pagename: null,
}

const pageSlice = createSlice(
    {
        name: "page",
        initialState,
        reducers: {
            pushPage: (state, action: PayloadAction<{ pageId: string | number, pagename: string }>) => {
                state.pageId = action.payload.pageId
                state.pagename = action.payload.pagename
            }
        }
    }
)

export const { pushPage } = pageSlice.actions
export default pageSlice.reducer