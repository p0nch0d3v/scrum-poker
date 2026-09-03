import { red } from '@mui/material/colors';

const lightPalette = {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    }
};

const darkPalette = {
    primary: {
      light: '#62B6CB',
      main: '#BEE9E8',
      dark: '#CAE9FF',
    },
    secondary: {
      light: '#62B6CB',
      main: '#BEE9E8',
      dark: '#CAE9FF',
    },
}

const theme = {
  darkPalette,
  lightPalette
}

export default theme;

