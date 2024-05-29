import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import socoLogo from "../../assets/img/openlap-logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "openlapTheme.main" }}>
        <Toolbar>
          <Grid container>
            <Grid item xl={2} />
            <Grid item xs>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid
                  item
                  onClick={() => navigate("/")}
                  component="img"
                  sx={{ height: 40, cursor: "pointer" }}
                  src={socoLogo}
                  alt="Soco logo"
                />

                <Grid item sx={{ display: { xs: "none", md: "block" } }}>
                  <Grid container alignItems="center">
                    <Button
                      disableRipple
                      size="large"
                      sx={{
                        mr: 1,
                        "&.MuiButton-root:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      News
                    </Button>
                    <Button
                      disableRipple
                      size="large"
                      sx={{
                        mr: 1,
                        "&.MuiButton-root:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      Architecture
                    </Button>
                    <Button
                      disableRipple
                      size="large"
                      sx={{
                        mr: 1,
                        "&.MuiButton-root:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      Publications
                    </Button>
                    <Button
                      disableRipple
                      size="large"
                      sx={{
                        mr: 1,
                        "&.MuiButton-root:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      Team
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ ml: 1 }}
                      onClick={() => navigate("/sign-in")}
                    >
                      sign in
                    </Button>
                  </Grid>
                </Grid>
                <Grid item sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton onClick={handleExpandClick} color="primary">
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xl={2} />
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          top: 64,
          display: { xs: "block", md: "none" },
          zIndex: 12,
          backgroundColor: "common.white",
          boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
          position: "sticky",
        }}
      >
        <Collapse in={expanded}>
          <Grid container direction="column" spacing={1} sx={{ p: 2 }}>
            <Button disableRipple size="large">
              News
            </Button>
            <Button disableRipple size="large">
              Architecture
            </Button>
            <Button disableRipple size="large">
              Publications
            </Button>
            <Button disableRipple size="large">
              Team
            </Button>

            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate("/sign-in")}
            >
              Sign in
            </Button>
          </Grid>
        </Collapse>
      </Box>
    </>
  );
};

export default Navbar;
