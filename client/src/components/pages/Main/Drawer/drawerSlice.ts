import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DrawerState {
  isOpen: boolean;
  isMobileView: boolean;
}

const initialState: DrawerState = {
  isOpen: false,
  isMobileView: false,
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    setIsOpened: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setIsMobileView: (state, action: PayloadAction<boolean>) => {
      state.isMobileView = action.payload;
    },
  },
});

export const { setIsOpened, setIsMobileView } = drawerSlice.actions;

export default drawerSlice.reducer;
