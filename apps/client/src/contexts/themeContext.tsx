import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";

type ThemeContextType = {
    toggleColorMode: () => void;
};

type ThemeProviderProps = {
    children: React.ReactNode;
};

export const ThemeContext = React.createContext({ switchColorMode: () => { } });

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const switchColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    console.log('switchColorMode', mode)
  }

  const theme = React.useMemo(
    () => 
      createTheme({
        palette: {
          mode,
        },
      }),
      [mode]
  );

  return (
    <ThemeContext.Provider value={{ switchColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );

};