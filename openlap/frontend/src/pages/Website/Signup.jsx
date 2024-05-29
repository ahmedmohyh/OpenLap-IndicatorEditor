import { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "../../utils/utils";
import { signUp } from "../../utils/backend";
import LoadingButton from "@mui/lab/LoadingButton";
import socoLogo from "../../assets/img/openlap-logo.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    error: false,
    description: "",
  });
  const [error, setError] = useState("");
  const [errorMessageFirstname, setErrorMessageFirstname] = useState("");
  const [errorMessageLastname, setErrorMessageLastname] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    scrollToTop();
  });

  const handleFormFields = (event) => {
    if (Boolean(message)) setMessage({ error: false, description: "" });
    const { name, value } = event.target;
    if (Boolean(errorMessageFirstname) && name === "firstname")
      setErrorMessageFirstname("");
    if (Boolean(errorMessageLastname) && name === "lastname")
      setErrorMessageLastname("");
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
    if (!Boolean(formFields.firstname)) {
      setErrorMessageFirstname("Firstname required!");
      return;
    }
    if (!Boolean(formFields.lastname)) {
      setErrorMessageLastname("Lastname required!");
      return;
    }
    if (!Boolean(formFields.email)) {
      setErrorMessageEmail("Email required!");
      return;
    }
    if (!Boolean(formFields.password)) {
      setErrorMessagePassword("Password required!");
      return;
    }
    setLoading(true);
    signUp(formFields)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          navigate("/sign-in");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.message === "Network Error") {
          setError(
            "Either email address is already taken or unable to connect to server! Please try again later."
          );
          return;
        }
        // setError("Email address already taken!");
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
            <Typography sx={{ px: 2 }}>Already have an account?</Typography>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
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
                  Sign up to create an account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        error={Boolean(errorMessageFirstname)}
                        helperText={errorMessageFirstname}
                        label="*First name"
                        name="firstname"
                        autoComplete="firstname"
                        autoFocus
                        onChange={handleFormFields}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        error={Boolean(errorMessageLastname)}
                        helperText={errorMessageLastname}
                        id="lastname"
                        label="*Lastname"
                        name="lastname"
                        autoComplete="lastname"
                        onChange={handleFormFields}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    margin="normal"
                    error={Boolean(errorMessageEmail)}
                    helperText={errorMessageEmail}
                    fullWidth
                    label="*Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleFormFields}
                  />
                  <TextField
                    margin="normal"
                    error={Boolean(errorMessagePassword)}
                    helperText={errorMessagePassword}
                    fullWidth
                    name="password"
                    label="*Password"
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
                    <span>Create Account</span>
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

export default Signup;
