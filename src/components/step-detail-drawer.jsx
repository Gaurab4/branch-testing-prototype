import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { closeDrawer } from "@/store/appSlice.js";
import { formatDuration } from "@/lib/utils.js";

function ScreenshotPlaceholder({ step }) {
  return (
    <Box
      sx={{
        position: "relative",
        aspectRatio: "16/9",
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 2,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            height: 96,
            width: "100%",
            maxWidth: 200,
            borderRadius: 2,
            border: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Screenshot · Step {step.order}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: "monospace" }}>
          {step.metadata.url ?? "viewport capture"}
        </Typography>
      </Box>
    </Box>
  );
}

export function StepDetailDrawer() {
  const dispatch = useAppDispatch();
  const drawerOpen = useAppSelector((s) => s.app.drawerOpen);
  const selectedStepId = useAppSelector((s) => s.app.selectedStepId);
  const testSteps = useAppSelector((s) => s.app.testSteps);
  const step = testSteps.find((s) => s.id === selectedStepId);

  return (
    <Drawer
      anchor="right"
      open={drawerOpen && Boolean(step)}
      onClose={() => dispatch(closeDrawer())}
      PaperProps={{ sx: { width: { xs: "100%", sm: 400 } } }}
    >
      {step && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "divider",
              p: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Step {step.order}
              </Typography>
              <Typography variant="h6">{step.title}</Typography>
            </Box>
            <IconButton onClick={() => dispatch(closeDrawer())} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <ScreenshotPlaceholder step={step} />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Main instruction
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover" }}>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {step.description}
                </Typography>
              </Paper>
            </Box>

            <Divider />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AutoAwesomeIcon fontSize="small" color="action" />
                <Typography variant="subtitle2">Agent reasoning</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover" }}>
                <Typography variant="body2" color="text.secondary">
                  {step.reasoning}
                </Typography>
              </Paper>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Execution metadata
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {step.metadata.selector && (
                  <MetaRow label="Selector" value={step.metadata.selector} mono />
                )}
                {step.metadata.confidence && (
                  <MetaRow
                    label="Agent confidence"
                    value={`${step.metadata.confidence}%`}
                    icon={<GpsFixedIcon sx={{ fontSize: 14 }} />}
                  />
                )}
                {step.durationMs && (
                  <MetaRow
                    label="Duration"
                    value={formatDuration(step.durationMs)}
                    icon={<TimerOutlinedIcon sx={{ fontSize: 14 }} />}
                  />
                )}
                {step.timestamp && (
                  <MetaRow label="Timestamp" value={step.timestamp} mono />
                )}
              </Box>
              {step.status === "reused" && (
                <Chip
                  label="Execution reused from checkpoint"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}

function MetaRow({ label, value, mono, icon }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {icon}
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontFamily: mono ? "monospace" : "inherit", fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}
