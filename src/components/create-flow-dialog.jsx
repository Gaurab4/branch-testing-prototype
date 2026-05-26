import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { closeCreateFlowModal } from "@/store/appSlice.js";
import { startSession } from "@/store/thunks.js";
import { DEFAULT_FLOW_SETUP } from "@/lib/mock-data.js";

export function CreateFlowDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.app.createFlowModalOpen);
  const isRunningMainPipeline = useAppSelector(
    (s) => s.app.isRunningMainPipeline
  );

  const [flowName, setFlowName] = useState(DEFAULT_FLOW_SETUP.flowName);
  const [testInstructions, setTestInstructions] = useState(
    DEFAULT_FLOW_SETUP.testInstructions
  );
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (open) {
      setFlowName(DEFAULT_FLOW_SETUP.flowName);
      setTestInstructions(DEFAULT_FLOW_SETUP.testInstructions);
    }
  }, [open]);

  const canStart =
    flowName.trim().length > 0 && testInstructions.trim().length > 0;

  const handleStart = async (e) => {
    e.preventDefault();
    if (!canStart || isStarting) return;
    setIsStarting(true);
    try {
      await dispatch(startSession(flowName, testInstructions));
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeCreateFlowModal())}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create flow</DialogTitle>
      <form onSubmit={handleStart}>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Define your flow, then start a branchable test session.
          </Typography>
          <TextField
            label="Flow Name"
            required
            fullWidth
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            placeholder="e.g. Cars nearby + Contact information Form"
            sx={{ mb: 3 }}
          />
          <TextField
            label="Test Instructions"
            required
            fullWidth
            multiline
            minRows={6}
            value={testInstructions}
            onChange={(e) => setTestInstructions(e.target.value)}
            placeholder="Describe what the AI agent should do…"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="button"
            onClick={() => dispatch(closeCreateFlowModal())}
            disabled={isStarting || isRunningMainPipeline}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            disabled={!canStart || isStarting || isRunningMainPipeline}
          >
            {isStarting || isRunningMainPipeline ? "Starting…" : "Start"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
