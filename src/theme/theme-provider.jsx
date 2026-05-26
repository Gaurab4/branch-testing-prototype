import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("autosana-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("autosana-theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#0a0a0a" : "#fafafa",
            paper: mode === "dark" ? "#141414" : "#ffffff",
          },
          primary: {
            main: mode === "dark" ? "#e5e5e5" : "#171717",
            contrastText: mode === "dark" ? "#0a0a0a" : "#fafafa",
          },
          secondary: {
            main: mode === "dark" ? "#a3a3a3" : "#525252",
          },
          divider: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: "none", fontWeight: 500 },
            },
          },
          MuiPaper: {
            defaultProps: { elevation: 0 },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundImage: "none",
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                "&:first-of-type": {
                  paddingTop: 8,
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#0a0a0a" : "#fafafa",
              },
              notchedOutline: {
                borderColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(0, 0, 0, 0.15)",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)",
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () =>
    setMode((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme: mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
