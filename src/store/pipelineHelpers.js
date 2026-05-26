const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export { delay };

export const defaultForkModal = () => ({
  open: false,
  editingBranchId: null,
  forkStepId: "step-3",
  forkStepNumber: 3,
  timelineCardId: "tl-3",
  branchName: "",
  modifiedInstruction: "",
  edgeCaseGoal: "",
});
