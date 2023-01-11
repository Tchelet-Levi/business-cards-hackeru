import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/system/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import React, { useEffect, useId, useState } from "react";
import useFetchBasic from "../../../hooks/useFetchBasic";
import { Image, Label } from "@mui/icons-material";
import useHandleUploadFile from "../../../hooks/useHandleUploadFile";
import zodCreateCardSchema from "../../../zod/zodCreateCardSchema";
import SnackbarMessage from "../Main/Profile/SnackbarMessage";
import zodEditCardSchema from "../../../zod/zodEditCardSchema";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbar: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  onSuccess: () => any;
  card_id?: string;
  card?: {
    businessName?: string;
    businessAddress?: string;
    businessDescription?: string;
    businessPhone?: string;
    businessImage?: string | undefined;
  };
};

export default function CardDialog({
  card,
  open,
  setOpen,
  setSnackbar,
  onSuccess,
  card_id,
}: Props) {
  const [formErrors, setFormErrors] = useState({
    businessName: "",
    businessDescription: "",
    businessAddress: "",
    businessPhone: "",
  });

  const [form, setForm] = useState({
    businessName: card?.businessName || "",
    businessDescription: card?.businessDescription || "",
    businessAddress: card?.businessAddress || "",
    businessPhone: card?.businessPhone || "",
    businessImage: card?.businessImage as string | undefined,
  });

  // When opening the dialog after closing it, make sure the field is reset.
  useEffect(() => {
    if (open === true) {
      setFormErrors({
        businessName: "",
        businessDescription: "",
        businessAddress: "",
        businessPhone: "",
      });

      setForm({
        businessName: card?.businessName || "",
        businessDescription: card?.businessDescription || "",
        businessAddress: card?.businessAddress || "",
        businessPhone: card?.businessPhone || "",
        businessImage: card?.businessImage as string | undefined,
      });
    }
  }, [open]);

  const theme = useTheme();
  const isScreenMediumSize = useMediaQuery(theme.breakpoints.down("md"));
  const isScreenSmallSize = useMediaQuery(theme.breakpoints.down("sm"));

  const [error, setError] = useState("");

  const handleUploadingFile = useHandleUploadFile();
  const fetchWithToken = useFetchBasic();
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  function openFileDialog() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  async function handleOnImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const { success, message } = await handleUploadingFile(e);

      if (success) {
        setForm((prev) => ({ ...prev, businessImage: message }));

        // Reset errors
        setError("");
      } else {
        // TODO: Show the user an appropriate error message.
        console.error(message);
        setError(message);
      }
    } catch (e) {
      console.error("Could not get response from the server.", e);
      setError("Could not get response from the server.");
    }
  }

  async function checkValidity() {
    const zodSchema = card_id
      ? zodEditCardSchema.safeParseAsync(form)
      : zodCreateCardSchema.safeParseAsync(form);

    const zodResult = await zodSchema;

    if (zodResult.success === false) {
      const fieldErrors = zodResult.error.formErrors.fieldErrors;

      const errors = {
        businessName: fieldErrors.businessName ? fieldErrors.businessName[0] : "",
        businessDescription: fieldErrors.businessDescription
          ? fieldErrors.businessDescription[0]
          : "",
        businessAddress: fieldErrors.businessAddress ? fieldErrors.businessAddress[0] : "",
        businessPhone: fieldErrors.businessPhone ? fieldErrors.businessPhone[0] : "",
      };

      setFormErrors(errors);

      return false;
    } else {
      return true;
    }
  }

  async function saveCard() {
    // Check validity
    const isValid = await checkValidity();

    // Don't continue if forms are not valid.
    if (!isValid) return;

    async function create() {
      // API request
      const res = await fetchWithToken("/api/create-card", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      const { success, message } = data;

      if (success) {
        // Close card, and show snackbar.
        setSnackbar(<SnackbarMessage message="Card successfully created." severity="success" />);
        onSuccess();
        setOpen(false);
      } else {
        setSnackbar(
          <SnackbarMessage message={`Card could not be added: ${message}`} severity="error" />
        );
      }
    }

    async function edit() {
      // API request
      const res = await fetchWithToken(`/api/edit-card?id=${card_id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      const { success, message } = data;

      if (success) {
        // Close card, and show snackbar.
        setSnackbar(<SnackbarMessage message="Card successfully edited." severity="success" />);
        onSuccess();
        setOpen(false);
      } else {
        setSnackbar(
          <SnackbarMessage message={`Card could not be edited: ${message}`} severity="error" />
        );
      }
    }

    try {
      // reset errors if any
      setError("");

      // If there's a supplemented card id, we should edit this existing card
      if (card_id) {
        await edit();
      } else {
        await create();
      }
    } catch (e) {
      console.error(e);
      <SnackbarMessage message={`Could not connect to the server..`} severity="error" />;
    }
  }

  return (
    <Dialog open={open} fullWidth maxWidth={"md"} fullScreen={isScreenSmallSize}>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", ml: -1 }} gap={2}>
          <IconButton size="large" onClick={(e) => setOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
          <span>{card_id ? "Edit Card" : "Create Card"}</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Container */}
        <Box
          sx={{
            width: 1280,
            maxWidth: "100%",
            display: "flex",
            mt: 1,

            justifyContent: isScreenMediumSize ? undefined : "center",
            alignItems: isScreenMediumSize ? "center" : undefined,
            flexDirection: isScreenMediumSize ? "column" : "row",
          }}
          gap={5}>
          {/* Form */}
          <Box sx={{ order: 1, width: "100%", maxWidth: isScreenMediumSize ? "100%" : 400 }}>
            <Box>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Business name"
                value={form.businessName}
                error={!!formErrors.businessName}
                helperText={formErrors.businessName && formErrors.businessName}
                onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
              />
            </Box>
            <Box sx={{ mt: 4 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                error={!!formErrors.businessDescription}
                helperText={formErrors.businessDescription && formErrors.businessDescription}
                label="Description"
                value={form.businessDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, businessDescription: e.target.value }))
                }
              />
            </Box>
            <Box sx={{ mt: 4 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Address"
                error={!!formErrors.businessAddress}
                helperText={formErrors.businessAddress && formErrors.businessAddress}
                value={form.businessAddress}
                onChange={(e) => setForm((prev) => ({ ...prev, businessAddress: e.target.value }))}
              />
            </Box>
            <Box sx={{ mt: 4 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Phone"
                error={!!formErrors.businessPhone}
                helperText={formErrors.businessPhone && formErrors.businessPhone}
                value={form.businessPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, businessPhone: e.target.value }))}
              />
            </Box>
          </Box>

          {/* Picture */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              order: 2,
            }}
            gap={2}>
            <Typography variant="body1">Business image (optional)</Typography>
            {form.businessImage && (
              <Box sx={{ position: "relative" }}>
                <Card
                  elevation={3}
                  sx={{
                    width: "fit-content",
                    position: "absolute",
                    top: ".5rem",
                    left: ".5rem",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "100vmax",
                    zIndex: 1,
                  }}>
                  <IconButton
                    onClick={(e) => setForm((prev) => ({ ...prev, businessImage: undefined }))}
                    title="Discard image"
                    size="medium">
                    <CloseRoundedIcon />
                  </IconButton>
                </Card>
                <Card elevation={1} sx={{ maxWidth: "100%", width: 345, aspectRatio: "16 / 9" }}>
                  {/* Card containing the image */}

                  <CardMedia
                    image={form.businessImage || "assets/images/placeholder.png"}
                    title="Business Image"
                    sx={{ height: "100%" }}
                  />
                </Card>
              </Box>
            )}

            <Button
              variant="text"
              startIcon={<UploadRoundedIcon />}
              onClick={(e) => openFileDialog()}>
              {form.businessImage
                ? `Upload a different picture`
                : "Upload a picture for your business"}
            </Button>

            {/* Errors */}
            {error && (
              <Box>
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      {/* Create */}
      <DialogActions sx={{ mt: 4 }}>
        <Button
          onClick={(e) => saveCard()}
          sx={{ lineHeight: 0, p: ".675rem 1rem .675rem 1rem" }}
          variant="outlined"
          endIcon={<AddRoundedIcon />}>
          {card_id ? "Save" : "Create"}
        </Button>
      </DialogActions>

      {/* Hidden input for file upload */}
      <input
        onChange={(e) => handleOnImageChange(e)}
        type="file"
        name="image"
        ref={inputFileRef}
        accept=".png,.jpg,.jpeg"
        className="visually-hidden"
      />
    </Dialog>
  );
}
