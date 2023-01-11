import { Button, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";
import useFetchBasic from "../../../../hooks/useFetchBasic";
import { useNavigate } from "react-router";
import useSignOut from "../../../../utils/useSignOut";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteWarning({ open, setOpen }: Props) {
  const [error, setError] = useState("");

  // Reset error whenever opening again after closing
  useEffect(() => {
    if (open) {
      setError("");
    }
  }, [open]);

  // Get the modified fetch function
  const fetchBasic = useFetchBasic();

  // Get sign out method
  const signOut = useSignOut();

  // Handle deleting the user
  async function deleteUser() {
    try {
      const res = await fetchBasic("/api/user", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();

      const { success, message } = data;

      console.log(res);
      console.log(data);

      if (!success) return setError(message);

      return signOut();
    } catch (e) {
      const err = e as any;
      setError(err);
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Delete your account?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete your account?</DialogContentText>
        <DialogContentText>
          <strong>This action cannot be undone.</strong>
        </DialogContentText>

        {/* Error */}
        {error && (
          <DialogContentText sx={{ mt: 2 }} color="error">
            Could not delete user.. Please try again later.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => deleteUser()} variant="contained" color="error">
          Delete my account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
