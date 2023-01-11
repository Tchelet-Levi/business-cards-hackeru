import { Image } from "@mui/icons-material";
import { CardMedia, Dialog, DialogTitle, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Box } from "@mui/system";
import React from "react";

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  address: string;
  phone: string;
  image?: string;
  name: string;
};

function ContactDialog({ open, setOpen, address, phone, image, name }: Props) {
  return (
    <Dialog open={open}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        <Box sx={{ flexGrow: 0 }}>
          <CardMedia
            component="img"
            image={image}
            alt={name}
            sx={{ width: { sx: 125, sm: 200 }, height: "100%", maxHeight: { xs: 200, sm: "100%" } }}
          />
        </Box>
        <Box sx={{ minWidth: { xs: 250, sm: 300 } }}>
          <DialogTitle>Contact Information</DialogTitle>
          <DialogContent>
            <Typography variant="overline" component="h3">
              Address
            </Typography>
            <Typography variant="body1" gutterBottom>
              {address}
            </Typography>
            <br />
            <Typography variant="overline" component="h3">
              Phone
            </Typography>
            <Typography variant="body1">+{phone}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

export default ContactDialog;
