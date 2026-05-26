import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { HeroSection } from "@/components/hero-section.jsx";
import { MetricsBar } from "@/components/metrics-bar.jsx";
import { TestFlowPanel } from "@/components/test-flow-panel.jsx";
import { TimelinePanel } from "@/components/timeline-panel.jsx";
import { BranchesPanel } from "@/components/branches-panel.jsx";
import { ForkModal } from "@/components/fork-modal.jsx";
import { StepDetailDrawer } from "@/components/step-detail-drawer.jsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { exitSession } from "@/store/appSlice.js";

export function TestSessionView() {
  const dispatch = useAppDispatch();
  const isRunningMainPipeline = useAppSelector(
    (s) => s.app.isRunningMainPipeline
  );

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        minHeight: 0,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => dispatch(exitSession())}
          disabled={isRunningMainPipeline}
          size="small"
        >
          Back to Flows
        </Button>
        {isRunningMainPipeline && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ animation: "pulse 2s infinite" }}
          >
            Main pipeline running…
          </Typography>
        )}
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <HeroSection />
        <MetricsBar />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          maxWidth: 1600,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ flex: 1, minHeight: 0, display: "flex" }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: { xs: 2, lg: 3 },
              gridTemplateColumns: { xs: "1fr", lg: "3fr 5fr 4fr" },
              alignItems: "stretch",
            }}
          >
            <TestFlowPanel />
            <TimelinePanel />
            <BranchesPanel />
          </Box>
        </motion.div>
      </Box>

      <ForkModal />
      <StepDetailDrawer />
    </Box>
  );
}
