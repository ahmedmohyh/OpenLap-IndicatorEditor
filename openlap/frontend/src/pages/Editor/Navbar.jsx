import { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import {
  Backdrop,
  CircularProgress,
  Grid,
  ListItem,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LogoutIcon from "@mui/icons-material/Logout";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import ListItemIcon from "@mui/material/ListItemIcon";
import openLapLogo from "../../assets/img/openlap-logo.svg";
import { v4 as uuidv4 } from "uuid";

const drawerWidth = 280;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar = ({ open, toggleDrawer, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = () => {
    setMenu((prevState) => !prevState);
    localStorage.clear();
    sessionStorage.clear();
    setLoggingOut(true);
    window.location.href = "/";
  };


  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        open={open}
        sx={{ zIndex: 11, backgroundColor: "openlapTheme.main" }}
      >
        <Toolbar>
          <Tooltip
            title={
              <Typography variant="body2" sx={{ p: 1 }}>
                Open sidebar
              </Typography>
            }
          >
            <IconButton
              color="primary"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
              onClick={toggleDrawer}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid
              item
              onClick={() => navigate("/dashboard")}
              sx={{
                cursor: "pointer",
                height: 40,
                ...(open && { display: "none" }),
              }}
              component="img"
              src={openLapLogo}
              alt="Soco logo"
            />
            <Tooltip
              title={
                <Typography variant="body2" sx={{ p: 1 }}>
                  Hide sidebar
                </Typography>
              }
            >
              <IconButton
                onClick={toggleDrawer}
                color="primary"
                sx={{ ...(!open && { display: "none" }) }}
                edge="start"
              >
                <FirstPageIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={<Typography>Open settings</Typography>}>
              <IconButton
                color="primary"
                onClick={(event) => setMenu(event.currentTarget)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menu}
              open={Boolean(menu)}
              onClose={() => setMenu(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem sx={{ py: 1.5 }}>
                <ListItemText>Account Settings</ListItemText>
                <ListItemIcon>
                  <PersonIcon color="primary"/>
                </ListItemIcon>
              </MenuItem>
              <ListItem divider>
                <ListItemText sx={{ mr: 6 }}>Dark Mode</ListItemText>
                <Switch checked={darkMode} onChange={toggleDarkMode} />
              </ListItem>

              <MenuItem sx={{ py: 1.5 }} onClick={handleSignOut}>
                <ListItemText>Sign out</ListItemText>
                <ListItemIcon>
                  <LogoutIcon color="primary"/>
                </ListItemIcon>
              </MenuItem>
            </Menu>
          </Grid>
        </Toolbar>
      </AppBar>

      <Backdrop open={loggingOut} sx={{ zIndex: 12, color: "common.white" }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <CircularProgress color="inherit" size={72} />
          </Grid>
          <Grid item>
            <Typography variant="h5">Signing out</Typography>
          </Grid>
        </Grid>
      </Backdrop>
    </>
  );
};

export default Navbar;
