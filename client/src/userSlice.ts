import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./components/pages/Signin/SigninTypes";
import { Action } from "@remix-run/router";

export type UserState = { user: User | null };

const initialState: UserState = { user: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (userState: UserState, action: PayloadAction<User | null>) => {
      if (action.payload === null) {
        userState.user = null;
      } else {
        userState.user = action.payload;
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
