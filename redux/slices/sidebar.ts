import { createSlice } from "@reduxjs/toolkit";

interface Sidebar {
  isOpen: boolean;
}

const initialState: Sidebar = { isOpen: true };

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleSidebar } = sideBarSlice.actions;
export default sideBarSlice.reducer;
