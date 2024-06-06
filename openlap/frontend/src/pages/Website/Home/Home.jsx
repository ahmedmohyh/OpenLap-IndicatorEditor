import { Box, Button, Grid, Typography } from "@mui/material";
import Team from "./Team";
import News from "./News";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import openlapLogo from "../../../assets/img/home-openlap-laptop.jpg";

const Home = () => {
  const navigate = useNavigate();

  const handleTestUser = () => {
    localStorage.setItem("userToken", import.meta.env.VITE_APP_TEST_KEY);
    setTimeout(() => {
      window.location.href = "/isc";
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <Grid
        container
        sx={{
          pt: 8,
          color: "grey.800",
          textAlign: "center",
        }}
        direction="column"
      >
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Define your analysis with
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2" sx={{ fontWeight: "bold" }}>
            Open Learning Analytics Platform
          </Typography>
        </Grid>
        <Grid item sx={{ py: 3 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="outlined" onClick={handleTestUser}>
                Try it
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => navigate("/sign-up")}>
                Sign up now
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" sx={{ py: 2 }}>
        <Grid item sx={{ maxWidth: 1600 }}>
          <Box
            component="img"
            sx={{ width: "100%" }}
            src={openlapLogo}
            alt="Soco home picture"
          />
        </Grid>
      </Grid>

      <Grid
        container
        sx={{ pt: 6, pb: 8, backgroundColor: "openlapTheme.light" }}
        spacing={4}
      >
        <Grid item md={2} />
        <Grid item xs={12} md={3}>
          <Team />
        </Grid>
        <Grid item xs={12} md={5}>
          <News />
        </Grid>
        <Grid item md={2} />
      </Grid>
    </>
  );
};

export default Home;
