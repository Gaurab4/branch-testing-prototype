import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import WebhookOutlinedIcon from "@mui/icons-material/WebhookOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const navItems = [
  { label: "Runs", icon: PlayCircleOutlinedIcon, active: false },
  { label: "Flows", icon: AccountTreeOutlinedIcon, active: true },
  { label: "Hooks", icon: WebhookOutlinedIcon, active: false },
  { label: "Apps", icon: SmartphoneOutlinedIcon, active: false },
  { label: "Automations", icon: BoltOutlinedIcon, active: false },
  { label: "Settings", icon: SettingsOutlinedIcon, active: false },
];

export function AppSidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: 224,
        flexShrink: 0,
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" fontWeight={700}>
            A
          </Typography>
        </Box>
        <Typography fontWeight={600}>Autosana</Typography>
      </Box>

      <List sx={{ flex: 1, p: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: "0.875rem" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
