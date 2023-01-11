import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type PageState = { name: string };

const initialState = { name: "Sign in" };

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPageName: (pageState: PageState, action: PayloadAction<string>) => {
      pageState.name = action.payload;
    },
  },
});

export const { setPageName } = pageSlice.actions;
export default pageSlice.reducer;
