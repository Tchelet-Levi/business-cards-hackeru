import { Button, DialogActions, DialogContent, DialogContentText, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";
import useFetchBasic from "../../../../../../hooks/useFetchBasic";
import SnackbarMessage from "../../../Profile/SnackbarMessage";
import { useNavigate } from "react-router";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  businessName: string;
  card_id: string;
  setSnackbar?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  onSuccess: () => any;
};

export default function DeletionWarning({
  open,
  setOpen,
  setSnackbar,
  businessName,
  card_id,
  onSuccess,
}: Props) {
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);

  // Reset error whenever opening again after closing
  useEffect(() => {
    if (open) {
      setError("");
      setFinished(false);
    }
  }, [open]);

  // Get the modified fetch function
  const fetchWithToken = useFetchBasic();

  useEffect(() => {
    if (finished) {
      onSuccess();
    }
  }, [finished]);

  // Handle deleting the user
  async function deleteCard() {
    if (setSnackbar === undefined) {
      console.error("setSnackbar function not provided to DeletionWarning.");
      return;
    }

    try {
      const res = await fetchWithToken(`/api/card?id=${card_id}`, { method: "DELETE" });
      const data = await res.json();

      const { success, message } = data;

      if (success) {
        setSnackbar(
          <SnackbarMessage message={`Deleted card "${businessName}".`} severity="success" />
        );

        setFinished(true);
        setOpen(false);
      } else {
        setSnackbar(<SnackbarMessage message={message} severity="error" />);
        // Close this dialog
        setOpen(false);
      }
    } catch (e) {
      const err = e as any;
      setError(err);
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Delete card?</DialogTitle>
      <DialogContent>
        <DialogContentText>You are about to delete Card:</DialogContentText>
        <DialogContentText>
          <Typography variant="body1">
            <strong>{businessName}</strong>
          </Typography>
        </DialogContentText>
        <br />
        <DialogContentText>
          Are you sure you want to delete this card? <br />
          <strong>This action cannot be undone.</strong>
        </DialogContentText>

        {/* Error */}
        {error && (
          <DialogContentText sx={{ mt: 2 }} color="error">
            Could not delete card.. Please try again later.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => deleteCard()} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
