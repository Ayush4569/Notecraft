import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Sidebar {
  isOpen: boolean;
}

const initialState: Sidebar = { isOpen: true };

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
});

export const { setSidebarState } = sideBarSlice.actions;
export default sideBarSlice.reducer;
