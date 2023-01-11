import Alert, { AlertColor } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import React, { useState } from "react";

type Props = {
  message: string;
  severity: AlertColor | undefined;
};

export default function SnackbarMessage({ message, severity }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
      <Alert
        variant="filled"
        elevation={6}
        severity={severity}
        sx={{ width: "100%" }}
        onClose={() => setOpen(false)}>
        {message}
      </Alert>
    </Snackbar>
  );
}
