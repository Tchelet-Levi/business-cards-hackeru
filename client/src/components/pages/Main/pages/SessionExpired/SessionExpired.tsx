import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router";

export default function SessionExpired() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "grid",
        placeContent: "center",
        textAlign: "center",
      }}
      gap={4}>
      <Box>
        <Typography variant="h4">Your session has expired.</Typography>
        <Typography>Sorry about that.</Typography>
      </Box>
      <Box>
        <Button onClick={() => navigate("/signin")} variant="outlined" size="large">
          Please sign in again
        </Button>
      </Box>
    </Box>
  );
}
