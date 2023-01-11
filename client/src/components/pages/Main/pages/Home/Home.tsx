import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import BusinessCard from "./Card/BusinessCard";
import Grid from "@mui/material/Grid";
import { IBusinessCard } from "../../../../../types";
import { Search } from "@mui/icons-material";
import InputBase from "@mui/material/InputBase";
import { CircularProgress, InputAdornment, Pagination, TextField } from "@mui/material";
import useFetch from "../../../../../hooks/useFetch";
import useGetAllCards from "../../../../../hooks/endpoints/useGetAllCards";
import usePageName from "../../../../../hooks/usePageName";
import { Helmet } from "react-helmet";
import { useOutletContext } from "react-router";
import { useMainRef } from "../../Main";

function Home() {
  // Set page name
  usePageName("Home");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { res, isLoading, error } = useGetAllCards(page);
  const data = res?.cards;

  const [cards, setCards] = useState<IBusinessCard[] | null>(null);

  useEffect(() => {
    if (data) {
      setCards(res.cards);
    }
  }, [res]);

  useEffect(() => {
    filterCardsByName();
  }, [search]);

  // Get outlet context
  const mainRef = useMainRef();

  function filterCardsByName() {
    if (data) {
      if (search === "") {
        return setCards(data);
      }

      setCards(
        data.filter((card) => card.businessName.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }

  useEffect(() => {
    // When we get new data, make sure we are scrolled up.
    mainRef.current?.scrollTo(0, 0);
  }, [res]);

  const renderCards = () => {
    if (cards) {
      return (
        <Grid container sx={{ justifyContent: { xs: "center" } }} gap={5}>
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

  const renderPagination = () => {
    if (res && res.maxPages > 1) {
      return (
        <Box sx={{ mb: 4 }}>
          <Pagination
            size="large"
            count={res.maxPages}
            page={res.page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      );
    }
  };
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
        <title>Card Share | Home</title>
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

      {/* Pagination */}
      <Box sx={{ m: "0 auto", mt: 0 }}>{renderPagination()}</Box>

      {/* Cards */}
      {renderCards()}

      {/* Pagination */}
      <Box sx={{ m: "0 auto", mt: 12, mb: 2 }}>{renderPagination()}</Box>
    </Box>
  );
}

export default Home;
