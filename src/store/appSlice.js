import { createSlice } from "@reduxjs/toolkit";
import {
  TIMELINE_CARDS,
  METRICS_DEFAULTS,
} from "../lib/mock-data.js";
import { buildPendingSteps } from "../lib/utils.js";
import { defaultForkModal } from "./pipelineHelpers.js";

const initialState = {
  sessionStarted: false,
  createFlowModalOpen: false,
  flows: [],
  activeFlowId: null,
  flowName: "",
  testInstructions: "",
  testSteps: buildPendingSteps("", ""),
  timelineCards: TIMELINE_CARDS,
  branches: [],
  selectedStepId: null,
  drawerOpen: false,
  forkModal: defaultForkModal(),
  isRunningMainPipeline: false,
  isReplayingBranch: false,
  reuseContextMessage: null,
  mergeMessage: null,
  activeBranchId: null,
  metrics: { ...METRICS_DEFAULTS },
  expandedTimelineIds: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    selectStep(state, action) {
      state.selectedStepId = action.payload;
      state.drawerOpen = true;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
    },
    toggleTimelineExpand(state, action) {
      const id = action.payload;
      const idx = state.expandedTimelineIds.indexOf(id);
      if (idx >= 0) state.expandedTimelineIds.splice(idx, 1);
      else state.expandedTimelineIds.push(id);
    },
    updateMainStepInstruction(state, action) {
      const { stepId, instruction } = action.payload;
      const trimmed = instruction.trim();
      if (!trimmed) return;
      const step = state.testSteps.find((s) => s.id === stepId);
      if (step) step.description = trimmed;
    },
    openCreateFlowModal(state) {
      state.createFlowModalOpen = true;
    },
    closeCreateFlowModal(state) {
      state.createFlowModalOpen = false;
    },
    exitSession(state) {
      state.sessionStarted = false;
      state.activeBranchId = null;
      state.reuseContextMessage = null;
      state.mergeMessage = null;
    },
    openCreateBranchModal(state, action) {
      const { forkModal } = action.payload;
      state.forkModal = forkModal;
    },
    openEditBranchModal(state, action) {
      state.forkModal = action.payload;
    },
    closeForkModal(state) {
      state.forkModal = defaultForkModal();
    },
    setForkModalField(state, action) {
      const { field, value } = action.payload;
      state.forkModal[field] = value;
    },
    patchState(state, action) {
      Object.assign(state, action.payload);
    },
    setTestSteps(state, action) {
      state.testSteps = action.payload;
    },
    setBranches(state, action) {
      state.branches = action.payload;
    },
    setFlows(state, action) {
      state.flows = action.payload;
    },
    updateBranch(state, action) {
      const { id, patch } = action.payload;
      const b = state.branches.find((x) => x.id === id);
      if (b) Object.assign(b, patch);
    },
    addBranch(state, action) {
      state.branches.push(action.payload);
    },
    removeBranch(state, action) {
      state.branches = state.branches.filter((b) => b.id !== action.payload);
    },
    setMetrics(state, action) {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    setMergeMessage(state, action) {
      state.mergeMessage = action.payload;
    },
    setReuseMessage(state, action) {
      state.reuseContextMessage = action.payload;
    },
    setRunningFlags(state, action) {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  selectStep,
  closeDrawer,
  toggleTimelineExpand,
  updateMainStepInstruction,
  openCreateFlowModal,
  closeCreateFlowModal,
  exitSession,
  openCreateBranchModal,
  openEditBranchModal,
  closeForkModal,
  setForkModalField,
  patchState,
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
} = appSlice.actions;

export default appSlice.reducer;
