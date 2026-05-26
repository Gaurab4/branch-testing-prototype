import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import Brightness7OutlinedIcon from "@mui/icons-material/Brightness7Outlined";
import { useTheme } from "@/theme/theme-provider.jsx";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
      <IconButton
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        disableRipple
        sx={{
          color: "text.secondary",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "action.hover",
          "&:hover": {
            color: "text.primary",
            bgcolor: "action.selected",
            borderColor: "text.disabled",
          },
        }}
      >
        {isDark ? (
          <Brightness7OutlinedIcon fontSize="small" />
        ) : (
          <Brightness4OutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
