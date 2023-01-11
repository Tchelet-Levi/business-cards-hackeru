import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import HomeRounded from "@mui/icons-material/HomeRounded";
import { AutoAwesomeMotionRounded, HelpRounded, LogoutRounded } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { setIsOpened } from "./drawerSlice";
import { useNavigate } from "react-router";
import { User } from "../../Signin/SigninTypes";
import useSignOut from "../../../../utils/useSignOut";

type ListItemType = {
  name: string;
  route: string;
  icon: React.ReactNode;
};

type Props = {
  variant: "permanent" | "temporary" | "persistent";
  drawerWidth: number;
  isOpen?: boolean | undefined;
};

function ResponsiveDrawer({ variant, drawerWidth, isOpen }: Props) {
  // Redux state
  const drawerState = useSelector((state: RootState) => state.drawerSlice);
  const userState = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();

  // Links (ordered list!)
  let listItems: ListItemType[] = [
    { name: "Home", route: "/", icon: <HomeRounded /> },
    { name: "My cards", route: "/my-cards", icon: <AutoAwesomeMotionRounded /> },
    { name: "About", route: "/about", icon: <HelpRounded /> },
  ];

  // If user is not a business user, remove the 'my cards' link
  const isBusinessAccount = userState.user?.isBusinessAccount;
  if (!isBusinessAccount) {
    listItems = listItems.splice(1);
  }

  // Navigation
  const navigate = useNavigate();

  // Use signout
  const signout = useSignOut();

  // user state
  const user = userState.user as User | null;

  // If the user is null, navigate back to sign in.
  if (user === null) {
    navigate("/signin");
    return <></>;
  }

  const handleOnClick = (route: string) => {
    dispatch(setIsOpened(false));
    navigate(route);
  };

  // Handle mobile
  const isMobile = variant === "temporary";
  const mobileDesktopVisibilityRules =
    variant === "permanent"
      ? { display: { xs: "none", sm: "block" } }
      : { display: { xs: "block", sm: "none" } };

  return (
    <Drawer
      variant={variant}
      open={isOpen}
      onClose={() => dispatch(setIsOpened(false))}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        mobileDesktopVisibilityRules,
      }}>
      <Toolbar sx={{ overflow: "hidden", maxWidth: "100%" }}>
        {/* Close button on Mobile */}
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={() => dispatch(setIsOpened(!drawerState.isOpen))}>
            <CloseRoundedIcon />
          </IconButton>
        )}

        {/* User info on Desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }} gap={2}>
            <Button
              onClick={(e) => navigate("/profile")}
              variant="text"
              color="inherit"
              sx={{ textTransform: "none" }}>
              <Avatar src={user?.avatar} sx={{ mr: 2 }} />
              <Typography noWrap variant="body1">
                {user.fullName}
              </Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
      <Divider />
      <List>
        {listItems.map((li: ListItemType) => (
          <ListItem key={li.name} disablePadding>
            <ListItemButton onClick={() => handleOnClick(li.route)}>
              <ListItemIcon>{li.icon}</ListItemIcon>
              <ListItemText primary={li.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List sx={{ mt: "auto" }}>
        <ListItem key="Sign out" disablePadding>
          <ListItemButton onClick={() => signout()}>
            <ListItemIcon>
              <LogoutRounded />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default ResponsiveDrawer;
