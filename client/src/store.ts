import { configureStore } from "@reduxjs/toolkit";
import drawerSlice from "./components/pages/Main/Drawer/drawerSlice";
import tokenSlice from "./tokenSlice";
import userSlice from "./userSlice";
import pageSlice from "./pageSlice";

export const store = configureStore({
  reducer: {
    drawerSlice,
    tokenSlice,
    userSlice,
    pageSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
