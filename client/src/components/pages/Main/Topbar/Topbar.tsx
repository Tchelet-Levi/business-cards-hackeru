import React from "react";
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type { RootState } from "../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { setIsOpened } from "../Drawer/drawerSlice";
import { AccountCircleRounded } from "@mui/icons-material";
import { useNavigate } from "react-router";

type Props = {
  drawerWidth: number;
};

function Topbar({ drawerWidth }: Props) {
  const drawerState = useSelector((state: RootState) => state.drawerSlice);
  const userState = useSelector((state: RootState) => state.userSlice);
  const pageState = useSelector((state: RootState) => state.pageSlice);
  const dispatch = useDispatch();

  // Navigation
  const navigate = useNavigate();

  const user = userState.user;

  return (
    <>
      <AppBar
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { sm: "none" } }}
              onClick={() => dispatch(setIsOpened(!drawerState.isOpen))}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {pageState.name}
            </Typography>
          </Box>

          {/* User icon */}
          <Box sx={{ display: { xs: "block", sm: "none" }, ml: "auto" }}>
            <IconButton onClick={() => navigate("/profile")}>
              <Avatar src={user?.avatar ? user.avatar : undefined} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Topbar;
