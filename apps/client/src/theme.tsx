import { ThemeOptions, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

export const themeOptions: ThemeOptions = {
  palette: {
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
  },
};


const theme = createTheme(themeOptions);

export default theme;

