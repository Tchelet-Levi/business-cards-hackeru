import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Token type
export type AuthToken = { value: string | null };

const initialState: AuthToken = { value: null };

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (token: AuthToken, action: PayloadAction<string | null>) => {
      token.value = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
