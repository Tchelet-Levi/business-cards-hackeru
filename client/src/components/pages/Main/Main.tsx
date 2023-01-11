import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResponsiveDrawer from "./Drawer/ResponsiveDrawer";
import Topbar from "./Topbar/Topbar";
import "./css/Main.css";
import { Box, Toolbar } from "@mui/material";
import { Height } from "@mui/icons-material";
import type { RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { setIsMobileView } from "./Drawer/drawerSlice";
import { Outlet, useOutletContext } from "react-router-dom";
import useGetUserInfo from "../../../hooks/endpoints/useGetUserInfo";
import { IUserInfo } from "../../../types";

const DRAWER_WIDTH = 240;

function Main() {
  // Handle ResponsiveDrawer
  const matches = useMediaQuery(useTheme().breakpoints.up("sm"));
  const isMobile = !matches;

  const drawerState = useSelector((state: RootState) => state.drawerSlice);
  const dispatch = useDispatch();

  const mainRef = useRef<HTMLElement>(null);

  // Get data from API
  const userData = useGetUserInfo();

  useEffect(() => {
    dispatch(setIsMobileView(isMobile));
  }, [isMobile]);

  return (
    <>
      {/* Header */}
      <Topbar drawerWidth={DRAWER_WIDTH} />

      {/* Drawer for Mobile */}
      {!matches && (
        <ResponsiveDrawer
          variant="temporary"
          isOpen={drawerState.isOpen}
          drawerWidth={DRAWER_WIDTH}
        />
      )}

      {/* Drawer for Desktop */}
      {matches && <ResponsiveDrawer variant="permanent" drawerWidth={DRAWER_WIDTH} />}

      {/* Body / Main */}
      <Box
        sx={{
          ml: { xs: 0, sm: `${DRAWER_WIDTH}px` },
          width: { xs: `100dvw)`, sm: `calc(100dvw - ${DRAWER_WIDTH}px)` },
          height: "100dvh",
        }}>
        <div className="main-wrapper">
          {/* This is here to take up space so that content isn't hidden behind the AppBar */}
          <Toolbar />

          <main ref={mainRef}>
            {/* The actual content */}
            <Outlet context={mainRef} />
          </main>
          <footer></footer>
        </div>
      </Box>
    </>
  );
}

export function useMainRef() {
  return useOutletContext<React.RefObject<HTMLElement>>();
}

// Hook to get user data from
export function useUser() {
  type ContextType = {
    user: IUserInfo;
    isLoading: boolean;
    error: {
      message: string;
      code: number | null;
    } | null;
  };
  return useOutletContext<ContextType>();
}

export default Main;
