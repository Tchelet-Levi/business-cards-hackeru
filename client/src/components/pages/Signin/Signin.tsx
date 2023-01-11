import {
  Button,
  FormControl,
  Grid,
  Link as MUILink,
  TextField,
  Typography,
  useFormControl,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APIResponse } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../tokenSlice";
import { RootState } from "../../../store";
import { setUser } from "../../../userSlice";
import { UserAPIRes } from "./SigninTypes";
import usePageName from "../../../hooks/usePageName";
import { Helmet } from "react-helmet";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setLoading] = useState(false);

  // Set page name
  usePageName("Sign in");

  // Redux
  const token = useSelector((state: RootState) => state.tokenSlice);
  const dispatch = useDispatch();

  // Navigate
  const navigate = useNavigate();

  async function onSigninClick(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    const body = JSON.stringify({
      email: email,
      password: password,
    });

    try {
      setLoading(true);
      const res = await fetch(`/api/signin`, {
        method: "POST",
        body: body,
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });
      setLoading(false);
      const data: APIResponse<UserAPIRes> = await res.json();

      if (data.success === true) {
        const message = data.message as UserAPIRes;
        const refreshToken = message.token;

        // Set the token
        dispatch(setToken(refreshToken));

        // Set user information
        dispatch(setUser(message.user));

        // Navigate to home
        navigate("/");
      } else {
        const errMsg = data.message as string;
        setError(errMsg);
      }
    } catch (e) {
      setError("Network error. Please try again later.");
      console.log(e);
    }
  }

  return (
    <Container component="main" maxWidth={"xs"}>
      {/* Helmet */}
      <Helmet>
        <title>Welcome to Card Share!</title>
      </Helmet>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}>
        <Typography component="h1" variant="h4">
          Welcome to CardShare
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
          }}>
          <Typography component="h2" variant="h5">
            Sign in
          </Typography>

          <FormControl>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="signin-email"
                  label="Email"
                  name="signin-email"
                  autoComplete="email"
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="signin-password"
                  label="Password"
                  name="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPass(e.currentTarget.value)}
                />
              </Grid>
            </Grid>
          </FormControl>

          {/* If there's an error, display it here */}
          {error && (
            <Typography variant="subtitle2" color="red" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            onClick={(e) => onSigninClick(e)}
            type="submit"
            fullWidth={true}
            variant="contained"
            sx={{ m: "auto", mt: 2 }}>
            Sign in
          </Button>

          <Grid container justifyContent="center">
            <Grid item sx={{ mt: 4 }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link to="/signup">
                  <MUILink href={"#"}>Sign up</MUILink>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
