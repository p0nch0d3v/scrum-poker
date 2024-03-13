import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff'
    },
    secondary: {
      main: '#ffbe0b'
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;

