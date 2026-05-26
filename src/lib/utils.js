import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { INITIAL_TEST_STEPS, cloneSteps } from "./mock-data.js";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

export function formatTimestamp(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function combineInstructions(main, branch) {
  const mainText = main.trim();
  const branchText = branch.trim();
  if (!branchText) return mainText;
  if (!mainText) return branchText;
  if (mainText.includes(branchText)) return mainText;
  return `${mainText}\n\nAlso: ${branchText}`;
}

export function buildPendingSteps(flowName, instructions) {
  return cloneSteps(INITIAL_TEST_STEPS).map((s) => ({
    ...s,
    status: "pending",
    timestamp: undefined,
    durationMs: undefined,
    ...(s.order === 1 ? { description: instructions, title: flowName } : {}),
  }));
}

export function completedMainSteps() {
  return cloneSteps(INITIAL_TEST_STEPS).map((s) => ({
    ...s,
    status: "completed",
    timestamp: `10:42:0${s.order}`,
    durationMs: 800 + s.order * 200,
  }));
}

export function syncMainFromBranch(mainSteps, branchSteps) {
  return mainSteps.map((main) => {
    const fromBranch = branchSteps.find((b) => b.id === main.id);
    if (!fromBranch) return main;
    return {
      ...main,
      status: fromBranch.status,
      timestamp: fromBranch.timestamp,
      durationMs: fromBranch.durationMs,
      reasoning: fromBranch.reasoning,
      description: fromBranch.description,
    };
  });
}
