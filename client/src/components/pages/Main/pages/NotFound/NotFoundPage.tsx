import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function NotFoundPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.primary.light,
        color: "white",
        display: "grid",
        placeContent: "center",
        textAlign: "center",
      }}>
      <Box>
        <Typography variant="h1" fontWeight={500}>
          Page doesn't exist.
        </Typography>
        <Typography variant="body1">Sorry pal.</Typography>
      </Box>
    </Box>
  );
}
