import {
  Avatar,
  Button,
  CardActions,
  CardMedia,
  ClickAwayListener,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography/Typography";
import React, { useState } from "react";
import ContactDialog from "./ContactDialog";
import { IBusinessCard } from "../../../../../../types";
import { User } from "../../../../Signin/SigninTypes";
import Box from "@mui/system/Box";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeletionWarning from "./DeletionWarning";
import SnackbarMessage from "../../../Profile/SnackbarMessage";
import CardDialog from "../../../../MyCards/CardDialog";

type Props = {
  businessDescription: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  card_id: string;
  businessImage?: string;
  isEditable?: boolean;
  reFetchCards?: () => Promise<void>;
  setSnackbar?: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

function BusinessCard({
  businessDescription,
  businessImage,
  businessName,
  businessPhone,
  businessAddress,
  card_id,
  isEditable,
  reFetchCards,
  setSnackbar,
}: Props) {
  // Open / Close Contact Information state
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const setOpen = (open: boolean) => {
    setIsOpenDialog(open);
  };

  // Expanded options state
  const [expandedOptions, setExpandedOptions] = useState(false);

  // Deletion warning dialog state
  const [deletionWarning, setDeletionWarning] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const image = businessImage || "assets/images/placeholder.png";

  // isEditable content
  function optionsButton() {
    // If content isn't editable or we are already expanded, return an empty node.
    if (!isEditable || expandedOptions) return <></>;

    const optionsButton = (
      <Paper
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          borderRadius: "100vmax",
          margin: 1,
        }}>
        <IconButton
          aria-expanded={expandedOptions}
          onClick={(e) => setExpandedOptions((prev) => !prev)}>
          {expandedOptions ? <CloseRoundedIcon /> : <SettingsRoundedIcon />}
        </IconButton>
      </Paper>
    );

    return <>{optionsButton}</>;
  }

  function expandedMenu() {
    if (!expandedOptions) return <></>;

    return (
      <ClickAwayListener onClickAway={() => setExpandedOptions(false)}>
        <Paper sx={{ position: "absolute", width: "67.5%", right: 0, margin: 1 }}>
          <MenuList>
            {/* Edit */}
            <MenuItem onClick={() => setEditOpen(true)}>
              <ListItemIcon>
                <EditRoundedIcon />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>

            {/* Delete */}
            <MenuItem onClick={() => setDeletionWarning(true)}>
              <ListItemIcon>
                <DeleteForeverRoundedIcon color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>

            <Divider />

            {/* Close */}
            <MenuItem onClick={() => setExpandedOptions(false)}>
              <ListItemIcon>
                <CloseRoundedIcon />
              </ListItemIcon>
              <ListItemText>Close</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </ClickAwayListener>
    );
  }

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {/* Editable content */}
        {optionsButton()}
        {expandedMenu()}

        <Card sx={{ width: "325px" }}>
          {/* Business Image */}
          <CardMedia component="img" height="194" image={image} alt={businessName} />

          <CardContent>
            {/* Business Address */}
            <Typography variant="overline" component="small">
              {businessAddress}
            </Typography>

            {/* Business Name */}
            <Typography variant="h5" component="h3" gutterBottom>
              {businessName}
            </Typography>
            {/* Business description */}
            <Typography variant="body2" color="text.secondary">
              {businessDescription}
            </Typography>
          </CardContent>

          {/* Actions */}
          <CardActions>
            <Button size="medium" onClick={() => setOpen(true)}>
              Contact
            </Button>
          </CardActions>
        </Card>

        {/* Contact dialog */}
        <ContactDialog
          open={isOpenDialog}
          setOpen={setOpen}
          address={businessAddress}
          phone={businessPhone}
          image={image}
          name={businessName}
        />
      </Box>

      {/* Deletion warning dialog */}
      <DeletionWarning
        open={deletionWarning}
        setOpen={setDeletionWarning}
        businessName={businessName}
        card_id={card_id}
        setSnackbar={setSnackbar}
        onSuccess={() => reFetchCards && reFetchCards()}
      />

      {/* Edit Card Dialog */}
      <CardDialog
        open={editOpen}
        setOpen={setEditOpen}
        setSnackbar={setSnackbar as React.Dispatch<React.SetStateAction<React.ReactNode>>}
        onSuccess={() => {
          const update = reFetchCards as () => Promise<void>;
          update();
        }}
        card_id={card_id}
        card={{
          businessName,
          businessDescription,
          businessAddress,
          businessImage,
          businessPhone,
        }}
      />
    </>
  );
}

export default BusinessCard;
