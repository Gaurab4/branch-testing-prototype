import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { AppSidebar } from "@/components/app-sidebar.jsx";
import { FlowsPage } from "@/components/flows-page.jsx";
import { TestSessionView } from "@/components/test-session-view.jsx";
import { CreateFlowDialog } from "@/components/create-flow-dialog.jsx";
import { ThemeToggle } from "@/components/theme-toggle.jsx";
import { useAppSelector } from "@/store/hooks.js";

export function PrototypeApp() {
  const sessionStarted = useAppSelector((s) => s.app.sessionStarted);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ flexShrink: 0 }}
      >
        <Toolbar
          variant="dense"
          sx={{ justifyContent: "flex-end", minHeight: 48 }}
        >
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <AppSidebar />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {sessionStarted ? <TestSessionView /> : <FlowsPage />}
        </Box>
        <CreateFlowDialog />
      </Box>
    </Box>
  );
}
