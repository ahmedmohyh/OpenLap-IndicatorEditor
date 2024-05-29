import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { Backdrop, Box, Button, CircularProgress, Collapse, Grid, IconButton, ListItemButton, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StyleIcon from "@mui/icons-material/Style";
import QuizIcon from "@mui/icons-material/Quiz";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddchartIcon from "@mui/icons-material/Addchart";
import { useDispatch, useSelector } from "react-redux";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { setSidebarMenu } from "../../utils/redux/reducers/reducer";
import openLAPLogo from "../../assets/img/openlap-logo.svg";
import ModalMessage from "./Common/Modal/ModalMessage";

export const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "center",
    backgroundColor: theme.palette.openlapTheme.main,
}));

const Sidebar = ({ open, testUser }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectedMenu = useSelector((state) => state.rootReducer.sidebarMenu);
    const [drawerWidth, setDrawerWidth] = useState(280);
    const [loggingOut, setLoggingOut] = useState(false);
    const [feedback, setFeedback] = useState({
        openSignOutModal: false,
    });

    const iscMenus = [
        {
            primary: "ISC Dashboard",
            secondary: "List of my ISCs",
            navigate: "/isc",
            icon: <DashboardIcon />,
            disabled: false,
        },
        {
            primary: "ISC Creator",
            secondary: "Create or edit an ISC",
            navigate: "/isc/creator",
            icon: <AddchartIcon />,
            disabled: false,
        },
    ];

    const gqiMenus = [
        {
            primary: "GQI Dashboard",
            secondary: "List of my Questions and associated Indicators",
            navigate: "/gqi",
            icon: <DashboardIcon />,
            disabled: testUser,
        },
        {
            primary: "GQI Editor",
            secondary: "Create Questions and associate Indicators",
            navigate: "gqi/editor",
            icon: <ListAltIcon />,
            disabled: testUser,
        },
    ];

    const indicatorMenus = [
        {
            primary: "Indicator Editor",
            secondary: "Create and View Basic, Composite, & Multi-level Indicator",
            navigate: "/indicator",
            icon: <DashboardIcon />,
            disabled: testUser,
        },
    ];

    const toolsMenu = [
        {
            primary: "CSV-xAPI Converter",
            secondary: "Convert CSV to xAPI and vice versa",
            navigate: "/csv-xapi-converter",
            icon: <ChangeCircleIcon />,
            disabled: testUser,
        },
    ];

    const [openGQI, setOpenGQI] = useState((selectedMenu === gqiMenus[0].navigate));
    const [openISC, setOpenISC] = useState((selectedMenu === iscMenus[0].navigate));
    const [openIndicator, setOpenIndicator] = useState((selectedMenu === indicatorMenus[0].navigate));
    const [openTools, setOpenTools] = useState((selectedMenu === toolsMenu[0].navigate));

    const handleFeedback = (name, value) => {
        setFeedback(() => ({
            ...feedback,
            [name]: !value,
        }));
    };

    const handleSignOutProcess = () => {
        handleFeedback("openSignOutModal", feedback.openSignOutModal);
    };

    const handleSignOut = () => {
        localStorage.clear();
        sessionStorage.clear();
        setLoggingOut(true);
        window.location.href = "/";
    };

    useEffect(() => {
        if (open) {
            setDrawerWidth(280);
        } else {
            setDrawerWidth(64);
        }
    }, [open]);

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    zIndex: open ? 3 : 0,
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <DrawerHeader sx={{ backgroundColor: "openlapTheme.main" }}>
                    <Box
                        component="img"
                        sx={{ height: 40, ...(!open && { display: "none" }) }}
                        src={openLAPLogo}
                        alt="Soco logo"
                    />
                </DrawerHeader>

                <Divider />

                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <List>
                            <ListItemButton onClick={() => setOpenISC(!openISC)}>
                                <ListItemIcon>
                                    <StyleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Indicator Specification Cards (ISC)" />
                                {openISC ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemButton>
                            <Collapse in={openISC} timeout={"auto"} unmountOnExit>
                                <List component="div" disablePadding>
                                    {iscMenus.map((menu, index) => {
                                        return (
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() => {
                                                    navigate(menu.navigate);
                                                    dispatch(setSidebarMenu(menu.navigate));
                                                }}
                                                key={index}
                                                disabled={menu.disabled}
                                                selected={selectedMenu === menu.navigate}
                                            >
                                                <ListItemIcon> {menu.icon} </ListItemIcon>
                                                <ListItemText
                                                    primary={menu.primary}
                                                    secondary={menu.secondary}
                                                />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </List>

                        <List>
                            <ListItemButton onClick={() => setOpenIndicator(!openIndicator)}>
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Indicators"} />
                                {openIndicator ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemButton>
                            <Collapse in={openIndicator} timeout={"auto"} unmountOnExit>
                                <List component="div" disablePadding>
                                    {indicatorMenus.map((menu, index) => {
                                        return (
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() => {
                                                    navigate(menu.navigate);
                                                    dispatch(setSidebarMenu(menu.navigate));
                                                }}
                                                key={index}
                                                disabled={menu.disabled}
                                                selected={selectedMenu === menu.navigate}
                                            >
                                                <ListItemIcon> {menu.icon} </ListItemIcon>
                                                <ListItemText
                                                    primary={menu.primary}
                                                    secondary={menu.secondary}
                                                />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </List>

                        <List>
                            <ListItemButton onClick={() => setOpenGQI(!openGQI)}>
                                <ListItemIcon>
                                    <QuizIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Goal-Question-Indicator"} />
                                {openGQI ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemButton>
                            <Collapse in={openGQI} timeout={"auto"} unmountOnExit>
                                <List component="div" disablePadding>
                                    {gqiMenus.map((menu, index) => {
                                        return (
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() => {
                                                    navigate(menu.navigate);
                                                    dispatch(setSidebarMenu(menu.navigate));
                                                }}
                                                key={index}
                                                disabled={menu.disabled}
                                                selected={selectedMenu === menu.navigate}
                                            >
                                                <ListItemIcon> {menu.icon} </ListItemIcon>
                                                <ListItemText
                                                    primary={menu.primary}
                                                    secondary={menu.secondary}
                                                />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </List>

                        <List>
                            <ListItemButton onClick={() => setOpenTools(!openTools)}>
                                <ListItemIcon>
                                    <ArchitectureIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Tools"} />
                                {openTools ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemButton>
                            <Collapse in={openTools} timeout={"auto"} unmountOnExit>
                                <List component="div" disablePadding>
                                    {toolsMenu.map((menu, index) => {
                                        return (
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() => {
                                                    navigate(menu.navigate);
                                                    dispatch(setSidebarMenu(menu.navigate));
                                                }}
                                                key={index}
                                                disabled={menu.disabled}
                                                selected={selectedMenu === menu.navigate}
                                            >
                                                <ListItemIcon> {menu.icon} </ListItemIcon>
                                                <ListItemText
                                                    primary={menu.primary}
                                                    secondary={menu.secondary}
                                                />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </List>
                    </div>

                    <Button onClick={handleSignOutProcess}>SignOut</Button>
                </div>
            </Drawer>

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
            {/**@author Louis Born <louis.born@stud.uni-due.de> */}
            <ModalMessage
                dialogTitle={"Sign out"}
                dialogPrimaryContext={`Are you sure you want to sign out?`}
                openDialog={feedback.openSignOutModal}
                setOpenDialog={() => handleFeedback("openSignOutModal", feedback.openSignOutModal)}
                primaryAction={handleSignOut}
                primaryButton={"Sign out"}
                tertiaryAction={() => handleFeedback("openSignOutModal", feedback.openSignOutModal)}
                tertiaryButton={"Cancel"}
            />
        </>
    );
};

export default Sidebar;
