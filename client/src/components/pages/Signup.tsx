import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Link as MUILink,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import zodSignUpSchema, { ZodSignUpSchemaType } from "../../zod/zodSignUpSchema";
import usePageName from "../../hooks/usePageName";
import { Helmet } from "react-helmet";
import useFetchBasic from "../../hooks/useFetchBasic";
import useSignup from "../../hooks/endpoints/useSignup";

export default function Signup() {
  // Loading state
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [signUpError, setSignUpError] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState<string>("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState<string>("");

  const [isBusiness, setIsBusiness] = useState(false);

  // UseFetch
  const basicFetch = useFetchBasic();

  // get signup function
  const signup = useSignup();

  // Navigation
  const navigate = useNavigate();

  // Set page name
  usePageName("Sign up");

  // Handles clicking the "Sign Up" button
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Check for base validity, and making sure the forms have been filled
    const isFormFilled = e.currentTarget.checkValidity();

    if (isFormFilled) e.preventDefault();
    if (!isFormFilled) return;

    // Check if rePassword is the same value as password
    if (password !== rePassword) {
      setRePasswordError("The passwords are not the same.");
    } else {
      setRePasswordError("");
    }

    // Create object out of state for zod
    const formSubmission: ZodSignUpSchemaType = {
      email,
      fullName,
      password,
      isBusinessAccount: isBusiness,
    };

    // Validate with Zod
    const zodResult = await zodSignUpSchema.safeParseAsync(formSubmission);

    // Update UI accordingly
    if (zodResult.success === false) {
      // Get the field errors
      const fieldErrors = zodResult.error.formErrors.fieldErrors;
      const { email, fullName, password } = fieldErrors;

      // Make error messages
      const emailMsg = email ? email[0] : "";
      const fullNameErrorMsg = fullName ? fullName[0] : "";
      const passwordErrorMsg = password ? password[0] : "";

      setEmailError(emailMsg);
      setFullNameError(fullNameErrorMsg);
      setPasswordError(passwordErrorMsg);
    }

    if (zodResult.success) {
      // Reset errors
      setEmailError("");
      setFullNameError("");
      setPasswordError("");

      try {
        // Show spinner
        setIsSigningUp(true);

        // Try signing up
        const { success, message } = await signup({
          email,
          fullName,
          password,
          isBusinessAccount: isBusiness,
        });
        if (success) {
          navigate("/");
        } else {
          setIsSigningUp(false);
          setSignUpError(message);
        }
      } catch (e) {
        setIsSigningUp(false);
        setSignUpError("Could not connect to the server. Please try again later.");
      }
    }
  }

  return (
    <>
      {/* Helmet */}
      <Helmet>
        <title>Sign up to Card Share!</title>
      </Helmet>

      <Container component="main" maxWidth={"xs"}>
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

          <FormControl>
            <Box
              component="form"
              onSubmit={(e) => handleSubmit(e)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 8,
              }}>
              <Typography component="h2" variant="h5">
                Sign up
              </Typography>

              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="signup-email"
                    label="Email"
                    name="signup-email"
                    autoComplete="email"
                    type={"email"}
                    value={email}
                    error={!!emailError}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="signup-fullname"
                    label="Full name"
                    name="signup-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.currentTarget.value)}
                    error={!!fullNameError}
                    helperText={!!fullNameError && fullNameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="signup-password"
                    label="Password"
                    name="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    error={!!passwordError}
                    helperText={!!passwordError && passwordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="signup-re-enter-password"
                    label="Re-enter password"
                    name="signup-re-enter-password"
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.currentTarget.value)}
                    error={!!rePasswordError}
                    helperText={!!rePasswordError && rePasswordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isBusiness}
                        onChange={(e) => setIsBusiness(e.currentTarget.checked)}
                        color={"primary"}
                      />
                    }
                    label="This is a business account"
                  />
                </Grid>
              </Grid>

              <Box sx={{ width: `100%`, mt: 4 }}>
                {signUpError && <Typography color="error">{signUpError}</Typography>}
                <LoadingButton
                  loading={isSigningUp}
                  type="submit"
                  fullWidth={true}
                  variant="contained"
                  sx={{ m: "auto", mt: 2 }}>
                  Sign up
                </LoadingButton>

                <Grid container justifyContent="center">
                  <Grid item sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Already have an account?{" "}
                      <Link to="/signin">
                        <MUILink href={"#"}>Sign in</MUILink>
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </FormControl>
        </Box>
      </Container>
    </>
  );
}
