import createMuiTheme from "@mui/material/styles/createMuiTheme";

const primaryLight = '#288FF7';
const primaryMain = '#097BED';
const primaryDark = '#0f69db';

// const secondaryLight = '#f4855d';
// const secondaryMain = '#f26b3a';
// const secondaryDark = '#f05215';
// const secondaryLight = '#ff7961';
// const secondaryMain = '#f44336';
// const secondaryDark = '#ba000d';

const contrastTextLight = '#ffffff';

export const darkTheme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 1110,
      lg: 1550,
      xl: 1920,
    }
  },
  palette: {
    primary: {
      light: primaryLight,
      main: primaryMain,
      dark: primaryDark,
      contrastText: contrastTextLight
    },
    // secondary: {
    //   light: secondaryLight,
    //   main: secondaryMain,
    //   dark: secondaryDark
    // },
    type: "dark",
    background: {
      paper: '#424242'
    }
  },
  overrides: {
    MuiCardHeader: {
      action: {
        marginTop: "auto",
        marginBottom: "auto"
      }
    }
  }
});

export const lightTheme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 1110,
      lg: 1550,
      xl: 1920,
    }
  },
  palette: {
    primary: {
      light: primaryLight,
      main: primaryMain,
      dark: primaryDark,
      contrastText: contrastTextLight
    },
    // secondary: {
    //   light: secondaryLight,
    //   main: secondaryMain,
    //   dark: secondaryDark,
    // },
    type: "light",
  },
  overrides: {
    MuiCardHeader: {
      action: {
        marginTop: "auto",
        marginBottom: "auto"
      }
    }
  }
});