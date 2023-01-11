import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BusinessCard from "../Main/pages/Home/Card/BusinessCard";
import useGetMyCards from "../../../hooks/endpoints/useGetMyCards";
import AddIcon from "@mui/icons-material/Add";
import { Theme } from "@mui/material/styles";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet";
import usePageName from "../../../hooks/usePageName";
import AddCardDialog from "./CardDialog";
import { IBusinessCard } from "../../../types";
import CardDialog from "./CardDialog";

function MyCards() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
  const [cards, setCards] = useState<IBusinessCard[] | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  

  usePageName("My Cards");

  const { cards: data, isLoading, error, update } = useGetMyCards();

  useEffect(() => {
    setCards(data);
  }, [data]);

  useEffect(() => {
    filterCardsByName();
  }, [search]);

  function filterCardsByName() {
    if (search === "") {
      setCards(data);
    }

    if (data) {
      setCards(
        data.filter((card) => card.businessName.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }

  const renderCards = () => {
    if (cards) {
      return (
        <Grid container sx={{ justifyContent: "center" }} gap={5}>
          {/* Map cards into BusinessCards */}

          {cards.map((card) => (
            <Grid item key={card.card_id}>
              <BusinessCard
                businessName={card.businessName}
                businessDescription={card.businessDescription}
                businessAddress={card.businessAddress}
                businessPhone={card.businessPhone}
                businessImage={card.businessImage}
                card_id={card.card_id}
                isEditable={true}
                reFetchCards={update}
                setSnackbar={setSnackbar}
              />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return (
        <Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Grid>
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 3.25,
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", sm: "initial" },
        }}>
        {/* Helmet */}
        <Helmet>
          <title>Card Share | My Cards</title>
        </Helmet>

        {/* Searchbar */}
        <Box sx={{ m: "0 auto", mb: 5 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter cards"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search></Search>
                </InputAdornment>
              ),
            }}></TextField>
        </Box>

        {/* Cards */}
        {renderCards()}

        {/* Add Card Desktop*/}
        <Box sx={{ m: "0 auto", mt: 5, display: { xs: "none", sm: "initial" } }}>
          <Button
            variant="contained"
            size="large"
            onClick={(e) => setAddOpen(true)}
            sx={{ gap: 1 }}>
            <span>Add Card</span>
            <AddIcon />
          </Button>
        </Box>

        {/* Add Card Mobile */}

        <Fab
          onClick={(e) => setAddOpen(true)}
          color="primary"
          aria-label="add"
          sx={{
            display: { sm: "none" },
            position: "absolute",
            bottom: (theme) => theme.spacing(4),
            right: (theme) => theme.spacing(4),
          }}>
          <AddIcon />
        </Fab>

        {/* Create Card Dialog */}
        <CardDialog
          open={addOpen}
          setOpen={setAddOpen}
          setSnackbar={setSnackbar}
          onSuccess={() => update()}
        />


        
      </Box>

      {/* Snackbar */}
      {snackbar}
    </>
  );
}

export default MyCards;
