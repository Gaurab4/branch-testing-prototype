import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LayersIcon from "@mui/icons-material/Layers";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector, useCanCreateBranchTesting } from "@/store/hooks.js";
import {
  tryOpenCreateBranchModal,
  tryOpenEditBranchModal,
  deleteBranch,
  mergeBranchInstruction,
} from "@/store/thunks.js";
import { formatDuration } from "@/lib/utils.js";

const statusConfig = {
  pending: { icon: HourglassEmptyIcon, color: "default", label: "Pending", variant: "outlined" },
  running: { icon: null, color: "warning", label: "Running" },
  completed: { icon: CheckCircleIcon, color: "success", label: "Passed" },
  failed: { icon: ErrorIcon, color: "error", label: "Failed" },
};

function BranchCard({ branch, index }) {
  const dispatch = useAppDispatch();
  const config = statusConfig[branch.status];
  const StatusIcon = config.icon;
  const activeBranchId = useAppSelector((s) => s.app.activeBranchId);
  const isActive = activeBranchId === branch.id;
  const isRunning = branch.status === "running";
  const canMerge =
    !isRunning && branch.status !== "pending" && !branch.mergedAt;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      style={{ position: "relative", marginLeft: 32 }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderColor:
            isActive && isRunning
              ? "primary.main"
              : branch.status === "completed"
                ? "success.light"
                : branch.status === "failed"
                  ? "error.light"
                  : "divider",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", minWidth: 0, alignItems: "center", gap: 1 }}>
            <AccountTreeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="body2" fontWeight={500} noWrap>
              {branch.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
            <Chip
              size="small"
              label={config.label}
              color={config.color}
              variant={config.variant ?? "filled"}
              icon={
                isRunning ? (
                  <CircularProgress size={12} color="inherit" />
                ) : StatusIcon ? (
                  <StatusIcon sx={{ fontSize: 14 }} />
                ) : undefined
              }
            />
            {branch.mergedAt && (
              <Chip size="small" label="Merged" color="success" variant="outlined" />
            )}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {branch.modifiedInstruction}
        </Typography>

        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          <Chip label={`From step ${branch.forkFromStepNumber}`} size="small" sx={{ fontFamily: "monospace", fontSize: "0.65rem" }} />
          {branch.savedTimeMs && (
            <Chip label={`Saved ${formatDuration(branch.savedTimeMs)}`} size="small" color="success" variant="outlined" sx={{ fontSize: "0.65rem" }} />
          )}
        </Box>

        {canMerge && (
          <Button
            fullWidth
            size="small"
            variant="contained"
            startIcon={<MergeTypeIcon sx={{ fontSize: 14 }} />}
            sx={{ mt: 1.5, fontSize: "0.75rem" }}
            onClick={() => dispatch(mergeBranchInstruction(branch.id))}
          >
            Merge Instruction
          </Button>
        )}

        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />}
            disabled={isRunning}
            sx={{ flex: 1, fontSize: "0.75rem" }}
            onClick={() => dispatch(tryOpenEditBranchModal(branch.id))}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlinedIcon sx={{ fontSize: 14 }} />}
            disabled={isRunning}
            sx={{ fontSize: "0.75rem" }}
            onClick={() => dispatch(deleteBranch(branch.id))}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </motion.li>
  );
}

export function BranchesPanel() {
  const dispatch = useAppDispatch();
  const flowName = useAppSelector((s) => s.app.flowName);
  const branches = useAppSelector((s) => s.app.branches);
  const canCreateBranchTesting = useCanCreateBranchTesting();

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          p: 2,
          pb: 1.5,
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Branch Testing
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Available after main pipeline finishes all steps
          </Typography>
        </Box>
      
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          pb: 2,
        }}
      >
        <Paper variant="outlined" sx={{ mb: 2, p: 1.5, display: "flex", alignItems: "center", gap: 1, bgcolor: "action.hover" }}>
          <LayersIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" fontWeight={500}>
            {flowName || "Agent Actions"}
          </Typography>
          <Chip label="main" size="small" variant="outlined" sx={{ ml: "auto", fontSize: "0.65rem" }} />
        </Paper>

        {branches.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderStyle: "dashed" }}>
            <AccountTreeIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No branch tests yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Branch from a step in the timeline to add one
            </Typography>
          </Paper>
        ) : (
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              m: 0,
              p: 0,
              pl: 2,
              borderLeft: 1,
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <AnimatePresence mode="popLayout">
              {branches.map((branch, i) => (
                <BranchCard key={branch.id} branch={branch} index={i} />
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
