import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Grid } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import GQIDashboard from "./GoalQuestionIndicator/GQIDashboard";
import Footer from "../Footer";
import Navbar from "./Navbar";
import Sidebar, { DrawerHeader } from "./Sidebar";
import GQIIntro from "./GoalQuestionIndicator/GQIIntro";
import ISCDashboard from "./IndicatorSpecificationCards/ISCDashboard";
import ISCCreator from "./IndicatorSpecificationCards/CreateIndicator/ISCCreator";
import CsvXapiConverter from "./Tools/CsvXapiConverter/CsvXapiConverter";
import ToCSV from "./Tools/CsvXapiConverter/ToCSV/ToCSV";
import ToXAPI from "./Tools/CsvXapiConverter/ToXAPI/ToXAPI";
import Dashboard from "./Indicators/Dashboard";
import BasicIndicator from './Indicators/BasicIndicator/BasicIndicator';
import CompositeIndicator from "./Indicators/CompositeIndicator/CompositeIndicator";
import MultiLevelIndicator from "./Indicators/MultiLevelIndicator/MultiLevelIndicator";

const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const EditorRoutes = ({ darkMode, toggleDarkMode }) => {
  const innerHeight = window.innerHeight;
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    /*if (isMatch && open) {
      setOpen(false);
    }*/
  }, [isMatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: `${innerHeight}px` }}>
      <SnackbarProvider maxSnack={3}>
        <div style={{ display: 'flex', paddingTop: '0px' }}>
          <Sidebar open={open} />

          <Main open={open}>
            <Box sx={{ p: 0, backgroundColor: '#f8f9fa', minHeight: `${(innerHeight - 40 - 1)}px` }}>
              <Routes>
                <Route path="/isc">
                  <Route index element={<ISCDashboard />} />
                  <Route path="creator" element={<ISCCreator />} />
                </Route>

                <Route path="/gqi">
                  <Route index element={<GQIDashboard />} />
                  <Route path="editor" element={<GQIIntro />} />
                </Route>

                <Route path="/indicator">
                  <Route index element={<Dashboard />} />
                  <Route path="create-basic" element={<BasicIndicator />} />
                  <Route path="create-composite" element={<CompositeIndicator />} />
                  <Route path="create-multi-level" element={<MultiLevelIndicator />} />
                </Route>

                <Route path="/csv-xapi-converter">
                  <Route index element={<CsvXapiConverter />} />
                  <Route path="to-csv" element={<ToCSV />} />
                  <Route path="to-xapi" element={<ToXAPI />} />
                </Route>

                <Route path="*" element={<Navigate to={"/indicator"} replace />} />
              </Routes>
            </Box>

            <Footer />
          </Main>
        </div>
      </SnackbarProvider>
    </div>
  );
};

export default EditorRoutes;
