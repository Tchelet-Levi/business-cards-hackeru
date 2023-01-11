import Box from "@mui/material/Box";
import React, { useState } from "react";
import usePageName from "../../../../hooks/usePageName";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import useGetUserInfo from "../../../../hooks/endpoints/useGetUserInfo";
import DeleteWarning from "./DeleteWarning";
import EditProfile from "./EditProfile";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import { User } from "../../Signin/SigninTypes";
import { IUserInfo } from "../../../../types";
import { Snackbar } from "@mui/material";
import { Helmet } from "react-helmet";

export default function Profile() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);

  usePageName("My Profile"); // Set page name

  // Get data from API, and refresh the state
  const { isLoading, error } = useGetUserInfo();

  const userState = useSelector((state: RootState) => state.userSlice);
  const user = userState.user as IUserInfo | null;

  if (error || user === null) return <>Error</>;
  if (isLoading) return <>Loading</>;
  return (
    <>
      {/* Wrapper */}
      <Box
        sx={{
          p: 3.25,
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", sm: "start" },
          height: "100%",
        }}>
        {/* Helmet */}
        <Helmet>
          <title>Card Share | Profile</title>
        </Helmet>

        {/* Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}>
          {/* Avatar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "start", sm: "center" },
              alignSelf: "start",
            }}>
            <Avatar sx={{ width: 128, height: 128 }} src={user?.avatar} />
            <Typography sx={{ mt: 2.25 }} variant="h5" component="p">
              {user.fullName}
            </Typography>
            <Typography sx={{ mt: 1 }} variant="body2">
              {user.email}
            </Typography>
            {user.isBusinessAccount && <Chip sx={{ mt: 2.25 }} label="Business account" />}
            <Button sx={{ mt: 2.25 }} variant="outlined" onClick={() => setEditDialogOpen(true)}>
              Edit Profile
            </Button>
          </Box>

          {/* Rest */}
        </Box>
        {/* Danger Zone */}
        <Box sx={{ mt: "auto" }}>
          <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column" }} gap={2}>
            <Button variant="text" color="error" onClick={() => setDeleteDialogOpen(true)}>
              Delete Account
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Delete dialog */}
      <DeleteWarning open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />

      {/* Edit profile dialog */}
      <EditProfile
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        user={user}
        setSnackbar={setSnackbar}
      />

      {/* Snackbar */}
      {snackbar}
    </>
  );
}
