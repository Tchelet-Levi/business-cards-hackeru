import { Alert, Box, Snackbar, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useId, useState } from "react";
import { IUserInfo } from "../../../../types";
import IconButton from "@mui/material/IconButton";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import TextField from "@mui/material/TextField";
import { StaticDatePicker } from "@mui/lab";
import FormControl from "@mui/material/FormControl";
import zodEditProfileSchema from "../../../../zod/zodEditProfileSchema";
import useFetchBasic from "../../../../hooks/useFetchBasic";
import { RootState } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../../userSlice";
import SnackbarMessage from "./SnackbarMessage";
import useHandleUploadFile from "../../../../hooks/useHandleUploadFile";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUserInfo;
  setSnackbar: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
};

export default function EditProfile({ open, setOpen, user, setSnackbar }: Props) {
  const userState = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();

  const handleUploadingFile = useHandleUploadFile();

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: user.email,
    fullName: user.fullName,
    avatar: user?.avatar,
    password: undefined as undefined | string,
  });

  type FormErrors = { email: null | string; fullName: null | string; password: null | string };
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: null,
    fullName: null,
    password: null,
  });

  // Get fetch that also handles tokens.
  const fetchWithToken = useFetchBasic();

  const inputFileRef = React.useRef<HTMLInputElement>(null);

  async function handleInputImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const data = await handleUploadingFile(e);
      const avatarPath = data.message;

      if (data.success) {
        // Set the avatar path
        setForm((form) => ({
          ...form,
          avatar: avatarPath,
        }));

        // Remove any previous image errors
        setError("");
      } else {
        console.error("Could not upload image..");
        setError(data.message);
      }
    } catch (e) {
      console.error("Could not get response from the server.", e);
    }
  }

  function openFileDialog() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  // Whenever the modal closes, reset the error and form states to their initial values.
  useEffect(() => {
    setForm({
      email: user.email,
      fullName: user.fullName,
      avatar: user?.avatar,
      password: undefined,
    });

    setFormErrors({
      email: null,
      fullName: null,
      password: null,
    });
  }, [open]);

  async function checkValidity() {
    const zodResult = await zodEditProfileSchema.safeParseAsync(form);

    if (zodResult.success === false) {
      const fieldErrors = zodResult.error.formErrors.fieldErrors;

      const errors = {
        email: fieldErrors.email ? fieldErrors.email[0] : null,
        fullName: fieldErrors.fullName ? fieldErrors.fullName[0] : null,
        password: fieldErrors.password ? fieldErrors.password[0] : null,
      };

      setFormErrors(errors);

      return false;
    } else {
      return true;
    }
  }

  async function handleSave(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // Check validity
    const isValid = await checkValidity();

    // Don't continue if invalid.
    if (!isValid) return;

    try {
      const res = await fetchWithToken("/api/user/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      const success = data.success;

      if (success) {
        dispatch(setUser(data.message));
        setSnackbar(<SnackbarMessage message="Successfully updated profile." severity="success" />);
        setOpen(false);
      } else {
        setSnackbar(<SnackbarMessage message="Could not update the profile.." severity="error" />);
      }
    } catch (e) {
      console.error("Error has occurred.", e);
      setSnackbar(
        <SnackbarMessage
          message="An error has occurred while connecting to the server.."
          severity="error"
        />
      );
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Box sx={{ display: "flex" }} gap={2}>
          <Box>Edit</Box>
          <Box sx={{ ml: 4, display: "flex" }} gap={2}>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" onClick={(e) => handleSave(e)}>
              Save
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        {/* Wrapper */}
        <Box sx={{ display: "flex", flexDirection: "column" }} gap={4}>
          {/* Avatar */}
          <Box sx={{ position: "relative", display: "grid", placeItems: "center" }}>
            <Avatar
              src={form.avatar}
              sx={{ height: 124, width: 124, gridRow: "1 / 2", gridColumn: "1/2" }}
            />
            <Box sx={{ gridRow: "1 / 2", gridColumn: "1/2" }}>
              <IconButton size="large" type="button" onClick={() => openFileDialog()}>
                <UploadRoundedIcon fontSize="large" />
              </IconButton>
            </Box>

            {error && <Typography color="error">{error}</Typography>}
          </Box>
          {/* Avatar end */}

          {/* Form */}
          <FormControl>
            <Box component="form" sx={{ mt: 4, display: "flex", flexDirection: "column" }} gap={4}>
              <TextField
                fullWidth
                required
                label="Full name"
                variant="outlined"
                value={form.fullName}
                onChange={(e) => setForm((state) => ({ ...state, fullName: e.target.value }))}
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
              />
              <TextField
                fullWidth
                required
                label="Email"
                variant="outlined"
                value={form.email}
                onChange={(e) => setForm((state) => ({ ...state, email: e.target.value }))}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                value={form.password}
                onChange={(e) => setForm((state) => ({ ...state, password: e.target.value }))}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </Box>
          </FormControl>
          {/* Form end */}
        </Box>
        {/* Wrapper end */}
      </DialogContent>

      {/* Hidden input for file upload */}
      <input
        onChange={(e) => handleInputImageChange(e)}
        type="file"
        name="image"
        ref={inputFileRef}
        accept=".png,.jpg,.jpeg"
        className="visually-hidden"
      />
    </Dialog>
  );
}
