import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { closeForkModal, setForkModalField } from "@/store/appSlice.js";
import { saveBranchFromModal } from "@/store/thunks.js";
import { FORK_PRESETS } from "@/lib/mock-data.js";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "background.default",
  },
};

export function ForkModal() {
  const dispatch = useAppDispatch();
  const forkModal = useAppSelector((s) => s.app.forkModal);
  const isEditing = Boolean(forkModal.editingBranchId);

  const setField = (field, value) =>
    dispatch(setForkModalField({ field, value }));

  const applyPreset = (index) => {
    const preset = FORK_PRESETS[index];
    setField("branchName", preset.name);
    setField("modifiedInstruction", preset.instruction);
    setField("edgeCaseGoal", preset.edgeCase);
  };

  return (
    <Dialog
      open={forkModal.open}
      onClose={() => dispatch(closeForkModal())}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { bgcolor: "rgba(0, 0, 0, 0.72)" },
        },
        paper: {
          sx: {
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            overflow: "visible",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{ px: 3, pt: 3, pb: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AccountTreeIcon fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="h2" fontWeight={600}>
              {isEditing ? "Update Branch Testing" : "Create New Branch Testing"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isEditing
                ? "Edit this branch. The main agent actions stay unchanged."
                : `Branch from step ${forkModal.forkStepNumber} — only this branch reruns downstream steps.`}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pt: 0,
          pb: 2,
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <TextField
          label="Branch name"
          fullWidth
          margin="none"
          variant="outlined"
          placeholder="e.g. Expired Coupon"
          value={forkModal.branchName}
          onChange={(e) => setField("branchName", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={textFieldSx}
        />
        <TextField
          label="Modified instruction"
          fullWidth
          margin="none"
          variant="outlined"
          placeholder="Apply expired coupon instead"
          value={forkModal.modifiedInstruction}
          onChange={(e) => setField("modifiedInstruction", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={textFieldSx}
        />
        <TextField
          label="Edge case goal (optional)"
          fullWidth
          margin="none"
          variant="outlined"
          placeholder="Validate error handling…"
          value={forkModal.edgeCaseGoal}
          onChange={(e) => setField("edgeCaseGoal", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={textFieldSx}
        />

        {!isEditing && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
              sx={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Quick presets
            </Typography>
            <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {FORK_PRESETS.map((preset, i) => (
                <motion.div
                  key={preset.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="small"
                    variant={
                      forkModal.branchName === preset.name
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => applyPreset(i)}
                    sx={{ textTransform: "none" }}
                  >
                    {preset.instruction}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, pt: 0 }}>
        <Button onClick={() => dispatch(closeForkModal())}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<AccountTreeIcon />}
          onClick={() => dispatch(saveBranchFromModal())}
          disabled={
            !forkModal.branchName.trim() ||
            !forkModal.modifiedInstruction.trim()
          }
        >
          {isEditing ? "Save Changes" : "Create Branch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
