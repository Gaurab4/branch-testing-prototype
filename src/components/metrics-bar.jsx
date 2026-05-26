import { motion, AnimatePresence } from "framer-motion";
import { formatDuration } from "@/lib/utils.js";
import { useAppSelector } from "@/store/hooks.js";

export function MetricsBar() {
  const metrics = useAppSelector((s) => s.app.metrics);
  const isReplaying = useAppSelector((s) => s.app.isReplayingBranch);
  const reuseMessage = useAppSelector((s) => s.app.reuseContextMessage);
  const mergeMessage = useAppSelector((s) => s.app.mergeMessage);

  const items = [
    { label: "Branches", value: String(metrics.branchCount) },
    {
      label: "Rerun savings",
      value: formatDuration(metrics.rerunSavingsMs),
    },
    {
      label: "Last replay",
      value: metrics.replayDurationMs
        ? formatDuration(metrics.replayDurationMs)
        : "—",
    },
  ];

  return (
    <div className="border-b bg-muted/20 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="font-mono text-sm font-medium tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
        <AnimatePresence>
          {(reuseMessage || mergeMessage || isReplaying) && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="ml-auto text-xs text-muted-foreground"
            >
              {reuseMessage || mergeMessage || "Replaying branch…"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
