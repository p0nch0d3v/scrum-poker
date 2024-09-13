import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import theme from "../theme";
import useLocalStorage from "../hooks/useLocalStorage";

interface ThemeContextType {
    switchColorMode: () => void;
    mode: 'light' | 'dark';
};

type ThemeProviderProps = {
    children: React.ReactNode;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  switchColorMode: () => {},
  mode: localStorage.getItem('theme') as 'light' | 'dark',
})

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useLocalStorage('theme', 'light');

  const switchColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }

  const contextTheme = React.useMemo(
    () => 
      createTheme(
        {
        palette: {
          mode,
          ...(mode === 'light') ? {
            ...theme.lightPalette
          }
          : {
            ...theme.darkPalette
        },
      }
      }),
      [mode]
  );

  return (
    <ThemeContext.Provider value={{ switchColorMode, mode }}>
      <ThemeProvider theme={contextTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );

};