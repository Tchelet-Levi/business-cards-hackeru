import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React from "react";
import { Helmet } from "react-helmet";
import usePageName from "../../../../../hooks/usePageName";

export default function About() {
  usePageName("About");

  return (
    <Box
      sx={{
        p: 3.25,
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", sm: "initial" },
      }}>
      {/* Helmet */}
      <Helmet>
        <title>Card Share | About</title>
      </Helmet>

      <Box textAlign={"center"}>
        <Typography sx={{ mb: 4 }} variant="h2">
          Our Story
        </Typography>
        <Typography>
          Our story begins like many others do, with humble beginnings as a passionate student doing
          homework. Established in 2022, <strong>Card Share &#8482;</strong> has amassed year(s) of
          experience and managed to help nearly no one around the globe share electronic cards for
          their businesses, a service which is highly in demand and not rendered obsolete by social
          media platforms.
        </Typography>
        <Typography>
          With <s>millions</s> <s>tens</s> at least one user(s), we are <em>confident</em> that you
          will find a comfortable place in the Card Share family.
        </Typography>
        <Typography>Here at Tchelet Levi studios, we write code, not copywriting.</Typography>
      </Box>
    </Box>
  );
}
