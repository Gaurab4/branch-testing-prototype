import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { runMainPipeline } from "@/store/thunks.js";

export function HeroSection() {
  const dispatch = useAppDispatch();
  const isRunningMainPipeline = useAppSelector(
    (s) => s.app.isRunningMainPipeline
  );
  const flowName = useAppSelector((s) => s.app.flowName);
  const testInstructions = useAppSelector((s) => s.app.testInstructions);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderBottom: 1,
        borderColor: "divider",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 5 },
      }}
    >
      <Box
        className="gradient-mesh"
        sx={{ pointerEvents: "none", position: "absolute", inset: 0 }}
      />
      <Box sx={{ position: "relative", maxWidth: 1600, mx: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="caption"
            sx={{
              mb: 1.5,
              display: "block",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Autosana · Prototype
          </Typography>
          <Typography variant="h4" component="h1" fontWeight={600} sx={{ maxWidth: 640 }}>
            {flowName || "Branchable AI Test Sessions"}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
            Turn AI-generated tests into reusable exploratory workflows.
          </Typography>
          {testInstructions && (
            <Box
              sx={{
                mt: 2,
                maxWidth: 520,
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Test instructions
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                {testInstructions}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 520 }}>
            Branch from any completed step, modify downstream actions, and test
            edge cases without rerunning entire flows.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              size="large"
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => dispatch(runMainPipeline())}
              disabled={isRunningMainPipeline}
            >
              {isRunningMainPipeline
                ? "Running main pipeline…"
                : "Re-run Main Pipeline"}
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
