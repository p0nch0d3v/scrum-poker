import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { darkPalette, lightPalette } from "../theme";

type ThemeContextType = {
    switchColorMode: () => void;
};

type ThemeProviderProps = {
    children: React.ReactNode;
};

export const ThemeContext = React.createContext<ThemeContextType | undefined>({ switchColorMode: () => { } });

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const switchColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    console.log('switchColorMode', mode)
  }

  const contextTheme = React.useMemo(
    () => 
      createTheme(
        {
        palette: {
          mode,
          ...(mode === 'light') ? {
            ...lightPalette
          }
          : {
            ...darkPalette
        },
      }
      }),
      [mode]
  );

  return (
    <ThemeContext.Provider value={{ switchColorMode }}>
      <ThemeProvider theme={contextTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );

};