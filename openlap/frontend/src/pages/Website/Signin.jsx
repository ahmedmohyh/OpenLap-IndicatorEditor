import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../utils/backend";
import socoLogo from "../../assets/img/openlap-logo.svg";

const Signin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const handleFormFields = (event) => {
    const { name, value } = event.target;
    if (Boolean(errorMessageEmail) && name === "email")
      setErrorMessageEmail("");
    if (Boolean(errorMessagePassword) && name === "password")
      setErrorMessagePassword("");
    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Boolean(formFields.email)) {
      setErrorMessageEmail("Email required!");
      return;
    }
    if (!Boolean(formFields.password)) {
      setErrorMessagePassword("Password required!");
      return;
    }
    setLoading(true);

    signIn(formFields)
      .then(() => {
        setLoading(false);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        setLoading(false);
        if (err.message === "Network Error") {
          setError(
            "Either incorrect username/password or unable to connect to server! Please try again later."
          );
          return;
        }
        // setError("Incorrect username/password. Please try again.");
      });
  };

  return (
    <>
      <Grid container sx={{ p: 2 }} justifyContent="space-between">
        <Grid
          item
          component="img"
          sx={{ height: 30, cursor: "pointer" }}
          src={socoLogo}
          alt="Soco logo"
          onClick={() => navigate("/")}
        />
        <Grid item>
          <Grid container alignItems="center">
            <Typography sx={{ px: 2 }}>Don't have an account yet?</Typography>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          height: "88vh",
          display: "flex",
          pt: 12,
          justifyContent: "center",
        }}
      >
        <Grid container sx={{ px: 2, maxWidth: 500 }} justifyContent="center">
          <Grid item>
            <Grid
              container
              component={Box}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <Grid item xs={12} sx={{ pb: 1 }}>
                <Typography variant="h5" align="center" color="grey.700">
                  Sign in to your account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    error={Boolean(errorMessageEmail)}
                    helperText={errorMessageEmail}
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    placeholder="example@mail.com"
                    autoFocus
                    onChange={handleFormFields}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    error={Boolean(errorMessagePassword)}
                    helperText={errorMessagePassword}
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleFormFields}
                  />
                  <Grid container sx={{ py: 1 }}>
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  </Grid>
                  <LoadingButton
                    type="submit"
                    fullWidth
                    loading={loading}
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    <span>Sign In</span>
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Signin;
