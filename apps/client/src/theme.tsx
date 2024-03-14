import { ThemeOptions, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    error: {
      main: red.A400,
    }
  },
};


const theme = createTheme(themeOptions);

export default theme;

