import {
  TIMELINE_CARDS,
  FORK_PRESETS,
  METRICS_DEFAULTS,
  createBranchSteps,
} from "../lib/mock-data.js";
import {
  buildPendingSteps,
  completedMainSteps,
  syncMainFromBranch,
  combineInstructions,
  formatTimestamp,
} from "../lib/utils.js";
import { delay, defaultForkModal } from "./pipelineHelpers.js";
import {
  patchState,
  closeForkModal,
  setTestSteps,
  setBranches,
  setFlows,
  updateBranch,
  addBranch,
  removeBranch,
  setMetrics,
  setMergeMessage,
  setReuseMessage,
  setRunningFlags,
  openCreateBranchModal,
  openEditBranchModal,
} from "./appSlice.js";

export const selectCanCreateBranchTesting = (state) => {
  const { testSteps, isRunningMainPipeline, isReplayingBranch } = state.app;
  if (isRunningMainPipeline || isReplayingBranch) return false;
  if (testSteps.length === 0) return false;
  return testSteps.every(
    (s) => s.status === "completed" || s.status === "reused"
  );
};

export const runMainPipeline = () => async (dispatch, getState) => {
  const state = getState().app;
  if (state.isRunningMainPipeline) return;

  const freshSteps = state.testSteps.map((s) => ({
    ...s,
    status: "pending",
    timestamp: undefined,
    durationMs: undefined,
  }));

  const { activeFlowId, flows } = state;

  dispatch(
    patchState({
      isRunningMainPipeline: true,
      testSteps: freshSteps,
      activeBranchId: null,
      reuseContextMessage: null,
      flows: activeFlowId
        ? flows.map((f) =>
            f.id === activeFlowId
              ? { ...f, latestStatus: "running", lastRun: "Just now" }
              : f
          )
        : flows,
    })
  );

  for (const step of freshSteps) {
    const current = getState().app.testSteps.map((s) =>
      s.id === step.id
        ? { ...s, status: "running", timestamp: formatTimestamp(new Date()) }
        : s
    );
    dispatch(setTestSteps(current));
    await delay(900 + Math.random() * 600);
    const done = getState().app.testSteps.map((s) =>
      s.id === step.id
        ? {
            ...s,
            status: "completed",
            durationMs: 700 + Math.floor(Math.random() * 1500),
          }
        : s
    );
    dispatch(setTestSteps(done));
  }

  const failed = getState().app.testSteps.some((s) => s.status === "failed");
  const latest = getState().app;

  dispatch(
    patchState({
      isRunningMainPipeline: false,
      flows: latest.activeFlowId
        ? latest.flows.map((f) =>
            f.id === latest.activeFlowId
              ? {
                  ...f,
                  latestStatus: failed ? "failed" : "passed",
                  lastRun: "Just now",
                }
              : f
          )
        : latest.flows,
    })
  );
};

export const runFlow = (flowId) => async (dispatch, getState) => {
  const flow = getState().app.flows.find((f) => f.id === flowId);
  if (!flow) return;

  const steps = buildPendingSteps(flow.name, flow.testInstructions);

  dispatch(
    patchState({
      sessionStarted: true,
      createFlowModalOpen: false,
      flowName: flow.name,
      testInstructions: flow.testInstructions,
      testSteps: steps,
      branches: [],
      activeBranchId: null,
      activeFlowId: flowId,
      metrics: { ...METRICS_DEFAULTS },
      flows: getState().app.flows.map((f) =>
        f.id === flowId
          ? { ...f, latestStatus: "running", lastRun: "Just now" }
          : f
      ),
    })
  );

  await dispatch(runMainPipeline());
};

export const startSession =
  (flowName, testInstructions) => async (dispatch, getState) => {
    const name = flowName.trim();
    const instructions = testInstructions.trim();
    if (!name || !instructions) return;

    const flowId = `flow-${Date.now()}`;
    dispatch(
      setFlows([
        {
          id: flowId,
          name,
          testInstructions: instructions,
          latestStatus: "running",
          lastRun: "Just now",
        },
        ...getState().app.flows,
      ])
    );
    await dispatch(runFlow(flowId));
  };

export const replayBranch = (branchId) => async (dispatch, getState) => {
  const state = getState().app;
  const branchIndex = state.branches.findIndex((b) => b.id === branchId);
  if (branchIndex === -1) return;

  let steps = [...state.branches[branchIndex].steps];
  const forkFrom = state.branches[branchIndex].forkFromStepNumber;

  dispatch(
    patchState({
      isReplayingBranch: true,
      reuseContextMessage: "Reusing completed execution context…",
      branches: state.branches.map((b) =>
        b.id === branchId ? { ...b, status: "running", steps } : b
      ),
      testSteps: syncMainFromBranch(state.testSteps, steps),
    })
  );

  await delay(1400);
  dispatch(setReuseMessage(null));

  const startReplay = Date.now();
  const metrics = state.metrics;

  for (let i = forkFrom - 1; i < steps.length; i++) {
    const step = steps[i];
    if (step.status === "reused") continue;

    steps = steps.map((s) =>
      s.id === step.id
        ? { ...s, status: "running", timestamp: formatTimestamp(new Date()) }
        : s
    );

    const mid = getState().app;
    dispatch(
      patchState({
        branches: mid.branches.map((b) =>
          b.id === branchId ? { ...b, steps } : b
        ),
        testSteps: syncMainFromBranch(mid.testSteps, steps),
      })
    );

    await delay(1000 + Math.random() * 600);

    const branch = getState().app.branches.find((b) => b.id === branchId);
    const instruction = branch?.modifiedInstruction.toLowerCase() ?? "";
    const shouldFail =
      (instruction.includes("expired") || instruction.includes("invalid")) &&
      step.order === forkFrom;
    const stepStatus = shouldFail ? "failed" : "completed";

    steps = steps.map((s) =>
      s.id === step.id
        ? {
            ...s,
            status: stepStatus,
            durationMs: 800 + Math.floor(Math.random() * 1200),
          }
        : s
    );

    const mid2 = getState().app;
    dispatch(
      patchState({
        branches: mid2.branches.map((b) =>
          b.id === branchId ? { ...b, steps } : b
        ),
        testSteps: syncMainFromBranch(mid2.testSteps, steps),
      })
    );

    if (stepStatus === "failed") {
      dispatch(
        patchState({
          branches: getState().app.branches.map((b) =>
            b.id === branchId
              ? { ...b, steps, status: "failed", savedTimeMs: 134000 }
              : b
          ),
          isReplayingBranch: false,
          metrics: {
            ...getState().app.metrics,
            rerunSavingsMs: metrics.rerunSavingsMs + 134000,
            replayDurationMs: Date.now() - startReplay,
          },
        })
      );
      return;
    }
  }

  const savedTimeMs = (forkFrom - 1) * 28000 + 38000;
  dispatch(
    patchState({
      branches: getState().app.branches.map((b) =>
        b.id === branchId
          ? { ...b, steps, status: "completed", savedTimeMs }
          : b
      ),
      isReplayingBranch: false,
      testSteps: syncMainFromBranch(getState().app.testSteps, steps),
      metrics: {
        ...getState().app.metrics,
        rerunSavingsMs: getState().app.metrics.rerunSavingsMs + savedTimeMs,
        replayDurationMs: Date.now() - startReplay,
      },
    })
  );
};

export const saveBranchFromModal = () => (dispatch, getState) => {
  const state = getState().app;
  const {
    branchName,
    modifiedInstruction,
    edgeCaseGoal,
    forkStepId,
    forkStepNumber,
    editingBranchId,
  } = state.forkModal;

  if (!branchName.trim() || !modifiedInstruction.trim()) return;

  const branchSteps = createBranchSteps(
    state.testSteps,
    forkStepNumber,
    modifiedInstruction
  );

  if (editingBranchId) {
    dispatch(
      patchState({
        branches: state.branches.map((b) =>
          b.id === editingBranchId
            ? {
                ...b,
                name: branchName,
                modifiedInstruction,
                edgeCaseGoal: edgeCaseGoal || undefined,
                steps: branchSteps,
                status: "pending",
                savedTimeMs: undefined,
                mergedAt: undefined,
              }
            : b
        ),
        activeBranchId: editingBranchId,
        testSteps: syncMainFromBranch(state.testSteps, branchSteps),
      })
    );
    dispatch(closeForkModal());
    dispatch(replayBranch(editingBranchId));
    return;
  }

  const branchId = `branch-${Date.now()}`;
  const branch = {
    id: branchId,
    name: branchName,
    modifiedInstruction,
    edgeCaseGoal: edgeCaseGoal || undefined,
    forkFromStepId: forkStepId,
    forkFromStepNumber: forkStepNumber,
    status: "pending",
    inheritedSteps: forkStepNumber - 1,
    steps: branchSteps,
    createdAt: formatTimestamp(new Date()),
  };

  dispatch(
    patchState({
      branches: [...state.branches, branch],
      metrics: { ...state.metrics, branchCount: state.branches.length + 1 },
      activeBranchId: branchId,
      testSteps: syncMainFromBranch(state.testSteps, branchSteps),
    })
  );
  dispatch(closeForkModal());
  dispatch(replayBranch(branchId));
};

export const mergeBranchInstruction = (branchId) => (dispatch, getState) => {
  const state = getState().app;
  const branch = state.branches.find((b) => b.id === branchId);
  if (!branch || branch.status === "running" || branch.status === "pending")
    return;

  const step = state.testSteps.find((s) => s.id === branch.forkFromStepId);
  if (!step) return;

  const combined = combineInstructions(
    step.description,
    branch.modifiedInstruction
  );

  dispatch(
    patchState({
      testSteps: state.testSteps.map((s) =>
        s.id === branch.forkFromStepId ? { ...s, description: combined } : s
      ),
      branches: state.branches.map((b) =>
        b.id === branchId
          ? { ...b, mergedAt: formatTimestamp(new Date()) }
          : b
      ),
      mergeMessage: `Combined main + branch instructions · step ${branch.forkFromStepNumber}`,
    })
  );

  setTimeout(() => dispatch(setMergeMessage(null)), 4000);
};

export const deleteBranch = (branchId) => (dispatch, getState) => {
  const state = getState().app;
  const wasActive = state.activeBranchId === branchId;
  dispatch(
    patchState({
      branches: state.branches.filter((b) => b.id !== branchId),
      activeBranchId: wasActive ? null : state.activeBranchId,
      metrics: {
        ...state.metrics,
        branchCount: Math.max(0, state.branches.length - 1),
      },
    })
  );
  if (wasActive) {
    dispatch(setTestSteps(completedMainSteps()));
  }
};

export const tryOpenCreateBranchModal =
  (forkStepNumber = 3, presetIndex) => (dispatch, getState) => {
    if (!selectCanCreateBranchTesting(getState())) return;

    const state = getState().app;
    const step = state.testSteps.find((s) => s.order === forkStepNumber);
    const card = TIMELINE_CARDS.find((c) => c.stepNumber === forkStepNumber);
    const preset =
      presetIndex !== undefined ? FORK_PRESETS[presetIndex] : undefined;

    dispatch(
      openCreateBranchModal({
        forkModal: {
          open: true,
          editingBranchId: null,
          forkStepId: step?.id ?? card?.forkStepId ?? `step-${forkStepNumber}`,
          forkStepNumber,
          timelineCardId: card?.id ?? "",
          branchName: preset?.name ?? "",
          modifiedInstruction:
            preset?.instruction ?? step?.description ?? "",
          edgeCaseGoal: preset?.edgeCase ?? "",
        },
      })
    );
  };

export const tryOpenEditBranchModal = (branchId) => (dispatch, getState) => {
  const branch = getState().app.branches.find((b) => b.id === branchId);
  if (!branch) return;
  dispatch(
    openEditBranchModal({
      open: true,
      editingBranchId: branchId,
      forkStepId: branch.forkFromStepId,
      forkStepNumber: branch.forkFromStepNumber,
      timelineCardId: "",
      branchName: branch.name,
      modifiedInstruction: branch.modifiedInstruction,
      edgeCaseGoal: branch.edgeCaseGoal ?? "",
    })
  );
};
