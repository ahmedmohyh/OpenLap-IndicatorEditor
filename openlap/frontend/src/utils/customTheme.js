import { createTheme } from "@mui/material";
import { orange, blue } from "@mui/material/colors";

const main = blue[700];
// const light = blue[500];
// const dark = blue[900];
const main2 = orange[500];
// const light = orange[300];
// const dark = orange[700];
// #F57C00
export const customTheme = createTheme({
  palette: {
    mode: "dark",
    // primary: {
    //   main: primaryDark,
    //   light: primaryLight,
    //   dark: primaryDark,
    // },
    openlapTheme: {
      white: "#FFFFFF",
      light: "#3E3E3E",
      main: "#272727",
      contrast: "#FFFFFF",
      dark: "#121212",
      secondary: main2,
      secondary2: main,
    },
  },
});
export const customThemeLight = createTheme({
  palette: {
    mode: "light",
    // primary: {
    //   main: primaryDark,
    //   light: primaryLight,
    //   dark: primaryDark,
    // },
    openlapTheme: {
      // main: "#272727",
      light: "#FFFFFF",
      main: "#F7F7F7",
      contrast: "#3f3f3f",
      dark: "#121212",
      secondary: main,
      secondary2: main2,
    },
  },
});
