import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Recycle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { selectStep } from "@/store/appSlice.js";
import { cn } from "@/lib/utils.js";

const statusIcon = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  reused: Recycle,
};

const statusColor = {
  pending: "text.secondary",
  running: "#f59e0b",
  completed: "#10b981",
  failed: "#ef4444",
  reused: "#3b82f6",
};

function StepRow({ step }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const Icon = statusIcon[step.status];

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Paper
        variant="outlined"
        onClick={() => dispatch(selectStep(step.id))}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            dispatch(selectStep(step.id));
          }
        }}
        role="button"
        tabIndex={0}
        sx={{
          p: 1.5,
          cursor: "pointer",
          borderColor:
            step.status === "running"
              ? "warning.light"
              : step.status === "failed"
                ? "error.light"
                : step.status === "reused"
                  ? "info.light"
                  : "divider",
          bgcolor: "background.paper",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Icon
            className={cn(step.status === "running" && "animate-spin")}
            style={{ width: 16, height: 16, marginTop: 2, color: statusColor[step.status] }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {step.title}
              </Typography>
              {step.timestamp && (
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                  {step.timestamp}
                </Typography>
              )}
            </Box>
            {step.status === "reused" && (
              <Typography variant="caption" color="info.main">
                Checkpoint reused
              </Typography>
            )}
            {step.status === "failed" && (
              <Typography variant="caption" color="error.main">
                Step failed
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            aria-label="Toggle details"
            sx={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {step.description}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
}

export function TestFlowPanel() {
  const flowName = useAppSelector((s) => s.app.flowName);
  const testSteps = useAppSelector((s) => s.app.testSteps);
  const doneCount = testSteps.filter(
    (s) =>
      s.status === "completed" ||
      s.status === "reused" ||
      s.status === "failed"
  ).length;
  const hasFailed = testSteps.some((s) => s.status === "failed");

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
      }}
    >
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {flowName || "Agent Actions"}
          </Typography>
          <Chip
            label={`${doneCount}/${testSteps.length}`}
            size="small"
            color={hasFailed ? "error" : "default"}
            variant="outlined"
            sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Reruns from branch point when you create branch testing
        </Typography>
      </Box>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {testSteps.map((step) => (
          <StepRow key={step.id} step={step} />
        ))}
      </Box>
    </Paper>
  );
}
