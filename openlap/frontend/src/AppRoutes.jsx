import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { customTheme, customThemeLight } from "./utils/customTheme";
import { CssBaseline } from "@mui/material";
import EditorRoutes from "./pages/Editor/EditorRoutes";
import WebsiteRoutes from "./pages/Website/WebsiteRoutes";

const AppRoutes = () => {
  const login = !!sessionStorage.getItem("userToken");
  const [darkMode, setDarkMode] = useState(
    JSON.parse(sessionStorage.getItem("openlap-settings"))?.darkMode || false
  );

  const toggleDarkMode = (event) => {
    let openlapSettings = JSON.parse(
      sessionStorage.getItem("openlap-settings")
    );
    setDarkMode(event.target.checked);
    let tempSettings = {
      ...openlapSettings,
      darkMode: event.target.checked,
    };
    sessionStorage.setItem("openlap-settings", JSON.stringify(tempSettings));
  };

  useEffect(()=> {
    sessionStorage.setItem("openlap-settings", JSON.stringify({darkMode: darkMode}));
  }, [])

  return (
    <>
      <ThemeProvider theme={darkMode ? customTheme : customThemeLight}>
        <CssBaseline />
        {!login ? (
          <WebsiteRoutes />
        ) : (
          <EditorRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        )}
      </ThemeProvider>
    </>
  );
};

export default AppRoutes;
