import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Clock,
  FileText,
  Pencil,
  Loader2,
  CheckCircle2,
  Circle,
  XCircle,
  Recycle
} from "lucide-react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useAppDispatch, useAppSelector, useCanCreateBranchTesting } from "@/store/hooks.js";
import { toggleTimelineExpand, updateMainStepInstruction } from "@/store/appSlice.js";
import { tryOpenCreateBranchModal } from "@/store/thunks.js";
import { TIMELINE_CARDS } from "@/lib/mock-data.js";
import { formatDuration } from "@/lib/utils.js";
import { cn } from "@/lib/utils.js";

const PIPELINE_STEP_GAP = 12;
const VISIBLE_PIPELINE_STEPS = 3;
const PIPELINE_CARD_HEIGHT = 248;
const PIPELINE_LIST_HEIGHT =
  VISIBLE_PIPELINE_STEPS * PIPELINE_CARD_HEIGHT +
  (VISIBLE_PIPELINE_STEPS - 1) * PIPELINE_STEP_GAP;

const statusIcon = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  reused: Recycle
};
const statusColor = {
  pending: "text-muted-foreground",
  running: "text-amber-500",
  completed: "text-emerald-500",
  failed: "text-red-500",
  reused: "text-blue-500"
};
function ConfidenceBar({ value, show }) {
  if (!show) return null;
  return <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${value}%` }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={cn(
      "h-full rounded-full",
      value >= 95 ? "bg-emerald-500" : value >= 90 ? "bg-amber-500" : "bg-orange-500"
    )}
  />
      </div>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>;
}
function PipelineStepCard({ step }) {
  const dispatch = useAppDispatch();
  const expandedIds = useAppSelector((s) => s.app.expandedTimelineIds);
  const testSteps = useAppSelector((s) => s.app.testSteps);
  const isRunningMainPipeline = useAppSelector((s) => s.app.isRunningMainPipeline);
  const mainPipelineComplete = useCanCreateBranchTesting();
  const [draftInstruction, setDraftInstruction] = useState(step.description);
  const [isEditing, setIsEditing] = useState(false);
  const expanded = expandedIds.includes(step.id);
  const meta = TIMELINE_CARDS.find((c) => c.stepNumber === step.order);
  const StatusIcon = statusIcon[step.status];
  const isActive = step.status === "running";
  const isDone = step.status === "completed" || step.status === "reused" || step.status === "failed";
  const canFork = mainPipelineComplete && testSteps.filter((s) => s.order < step.order).every((s) => s.status === "completed" || s.status === "reused");
  const handleSaveInstruction = () => {
    dispatch(
      updateMainStepInstruction({
        stepId: step.id,
        instruction: draftInstruction,
      })
    );
    setIsEditing(false);
  };
  const handleExpand = () => {
    if (!expanded) {
      setDraftInstruction(step.description);
      setIsEditing(false);
    }
    dispatch(toggleTimelineExpand(step.id));
  };
  return <motion.div
    layout
    initial={{ opacity: 0, y: 16, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -8, scale: 0.97 }}
    transition={{
      type: "spring",
      stiffness: 380,
      damping: 28
    }}
    className="relative"
    data-pipeline-step={step.id}
  >
      <motion.div
    animate={isActive ? {
      boxShadow: [
        "0 0 0 0px hsl(var(--amber-500) / 0)",
        "0 0 0 4px hsl(38 92% 50% / 0.15)",
        "0 0 0 0px hsl(var(--amber-500) / 0)"
      ]
    } : {}}
    transition={isActive ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : void 0}
    className={cn(
      "absolute -left-6 top-4 flex h-[22px] w-[22px] items-center justify-center rounded-full border bg-card text-[10px] font-mono font-medium shadow-sm",
      isActive && "border-amber-500/50 bg-amber-500/10",
      step.status === "completed" && "border-emerald-500/40 bg-emerald-500/10",
      step.status === "failed" && "border-red-500/40 bg-red-500/10",
      step.status === "reused" && "border-blue-500/40 bg-blue-500/10"
    )}
  >
        {step.order}
      </motion.div>

      <motion.div
    layout
    className={cn(
      "rounded-xl border bg-card p-3 transition-colors duration-300",
      expanded && "shadow-md",
      isActive && "border-amber-500/40 bg-amber-500/5",
      step.status === "completed" && "border-emerald-500/25",
      step.status === "failed" && "border-red-500/25",
      step.status === "reused" && "border-blue-500/20",
      canFork && "hover:border-foreground/15"
    )}
  >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <StatusIcon
    className={cn(
      "h-4 w-4 shrink-0",
      statusColor[step.status],
      isActive && "animate-spin"
    )}
  />
              <h4 className="text-sm font-medium">{step.title}</h4>
            </div>
            {meta && <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-0.5 pl-6 text-xs text-muted-foreground"
  >
                {meta.title}
              </motion.p>}
            {isActive && <motion.p
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    className="mt-1 pl-6 text-[10px] font-medium text-amber-600 dark:text-amber-400"
  >
                Processing…
              </motion.p>}
          </div>
          <button
    type="button"
    onClick={handleExpand}
    className="shrink-0 rounded p-1 hover:bg-muted"
    aria-label={expanded ? "Collapse" : "Expand"}
  >
            <ChevronDown
    className={cn(
      "h-4 w-4 transition-transform",
      expanded && "rotate-180"
    )}
  />
          </button>
        </div>

        <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: isDone || isActive ? 1 : 0.6 }}
    className="mt-2 rounded-lg border bg-muted/30 px-2.5 py-2"
  >
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3 w-3" />
            Main instruction
          </div>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
            {step.description}
          </p>
        </motion.div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <AnimatePresence mode="wait">
            {isActive && <motion.div
    key="running"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
                <Chip
    size="small"
    variant="outlined"
    color="warning"
    icon={<Loader2 className="h-3 w-3 animate-spin" />}
    label="Running"
  />
              </motion.div>}
            {isDone && meta && <motion.div
    key="done"
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
                <Chip
    size="small"
    variant="outlined"
    icon={<Clock className="h-3 w-3" />}
    label={step.durationMs ? formatDuration(step.durationMs) : formatDuration(meta.durationMs)}
    sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
  />
              </motion.div>}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {expanded && <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="overflow-hidden"
  >
              <div className="mt-3 space-y-3 border-t pt-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="caption" color="text.secondary">
                      Edit main instruction
                    </Typography>
                    {!isEditing && <Button
    type="button"
    size="small"
    startIcon={<Pencil className="h-3 w-3" />}
    onClick={() => {
      setDraftInstruction(step.description);
      setIsEditing(true);
    }}
  >
                        Edit
                      </Button>}
                  </div>
                  {isEditing ? <div className="space-y-2">
                      <TextField
    fullWidth
    multiline
    minRows={3}
    size="small"
    value={draftInstruction}
    onChange={(e) => setDraftInstruction(e.target.value)}
  />
                      <div className="flex gap-2">
                        <Button
    type="button"
    size="small"
    variant="contained"
    onClick={handleSaveInstruction}
    disabled={!draftInstruction.trim()}
  >
                          Save instruction
                        </Button>
                        <Button
    type="button"
    size="small"
    variant="outlined"
    onClick={() => {
      setDraftInstruction(step.description);
                      setIsEditing(false);
    }}
  >
                          Cancel
                        </Button>
                      </div>
                    </div> : <p className="text-xs text-muted-foreground">
                      Click Edit to change what the agent should do at this
                      step.
                    </p>}
                </div>

                {meta && isDone && <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Last execution
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Agent confidence
                    </p>
                    <ConfidenceBar value={meta.confidence} show />
                  </motion.div>}
              </div>
            </motion.div>}
        </AnimatePresence>

        <div className="mt-3">
          <Button
    size="small"
    fullWidth
    variant={canFork ? "contained" : "outlined"}
    disabled={!canFork}
    startIcon={<AccountTreeIcon sx={{ fontSize: 14 }} />}
    onClick={() => dispatch(tryOpenCreateBranchModal(step.order))}
  >
            Create New Branch Testing
          </Button>
          {!mainPipelineComplete && <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              {isRunningMainPipeline ? "Wait for main pipeline to finish" : "Complete all main pipeline steps first"}
            </p>}
        </div>
      </motion.div>
    </motion.div>;
}
export function TimelinePanel() {
  const scrollRef = useRef(null);
  const testSteps = useAppSelector((s) => s.app.testSteps);
  const isRunningMainPipeline = useAppSelector((s) => s.app.isRunningMainPipeline);
  const sortedSteps = [...testSteps].sort((a, b) => a.order - b.order);
  const visibleSteps = sortedSteps.filter((s) => s.status !== "pending");
  const pendingCount = sortedSteps.length - visibleSteps.length;
  const runningStep = testSteps.find((s) => s.status === "running");

  useEffect(() => {
    if (!runningStep?.id || !scrollRef.current) return;

    const scrollActiveIntoView = () => {
      const el = scrollRef.current?.querySelector(
        `[data-pipeline-step="${runningStep.id}"]`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const frame = requestAnimationFrame(scrollActiveIntoView);
    const timer = setTimeout(scrollActiveIntoView, 150);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [runningStep?.id, visibleSteps.length, isRunningMainPipeline]);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexShrink: 0, p: 2, pb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Main Pipeline
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {isRunningMainPipeline
            ? "Steps appear as the pipeline runs…"
            : "Branch testing unlocks after the full main pipeline completes"}
        </Typography>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          height: PIPELINE_LIST_HEIGHT,
          maxHeight: PIPELINE_LIST_HEIGHT,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          pb: 2,
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Box
          className="relative pl-6"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${PIPELINE_STEP_GAP}px`,
            pb: 1,
          }}
        >
            {visibleSteps.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  left: "11px",
                  top: 8,
                  bottom: 24,
                  width: "1px",
                  bgcolor: "divider",
                }}
              />
            )}

            <AnimatePresence mode="popLayout">
              {visibleSteps.map((step) => <PipelineStepCard key={step.id} step={step} />)}
            </AnimatePresence>

            {pendingCount > 0 && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2 pl-1 text-xs text-muted-foreground"
  >
                <Loader2
    className={cn(
      "h-3.5 w-3.5",
      isRunningMainPipeline && "animate-spin"
    )}
  />
                <span>
                  {pendingCount} step{pendingCount > 1 ? "s" : ""} queued…
                </span>
              </motion.div>}
        </Box>
      </Box>
    </Paper>
  );
}
