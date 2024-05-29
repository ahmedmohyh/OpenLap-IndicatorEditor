import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Signin from "./Signin";
import Signup from "./Signup";
import { Grid } from "@mui/material";
import Footer from "../Footer";

const WebsiteRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="sign-in" element={<Signin />} />
          <Route path="sign-up" element={<Signup />} />
        </Route>
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Routes>
      <Grid container>
        <Grid item lg={2} />
        <Footer />
        <Grid item lg={2} />
      </Grid>
    </>
  );
};

export default WebsiteRoutes;
