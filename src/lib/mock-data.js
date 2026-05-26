export const AGENT_ACTIONS_NAME = "Agent Actions";

export const DEFAULT_FLOW_SETUP = {
  flowName: "Cars nearby + Contact information Form",
  testInstructions: `Go to the shop tab, reveal the "cars nearby" button, check the availability of a random car of your choice, fill out the contact information and submit, confirm when done`,
};

export const INITIAL_TEST_STEPS = [
  {
    id: "step-1",
    order: 1,
    title: "Open checkout page",
    description: "Navigate to /checkout and verify cart summary",
    status: "pending",
    reasoning:
      "Located checkout CTA on cart page. Page loaded with 2 items in summary.",
    metadata: {
      selector: "[data-testid='checkout-btn']",
      confidence: 96,
      url: "/checkout",
    },
  },
  {
    id: "step-2",
    order: 2,
    title: "Add product to cart",
    description: "Confirm line items and quantities match test spec",
    status: "pending",
    reasoning:
      "Verified cart contains Wireless Headphones ×1. Quantity selector stable.",
    metadata: {
      selector: ".cart-line-item",
      selfHealed: true,
      confidence: 94,
    },
  },
  {
    id: "step-3",
    order: 3,
    title: "Apply coupon",
    description: "Enter coupon code and validate discount applied",
    status: "pending",
    reasoning:
      "Detected coupon input field and applied WINTER20 code. Discount −$24.00 shown.",
    metadata: { selector: "#coupon-input", confidence: 94 },
  },
  {
    id: "step-4",
    order: 4,
    title: "Complete payment",
    description: "Fill payment form and submit transaction",
    status: "pending",
    reasoning:
      "Filled Stripe test card fields. Payment modal accepted. Submit clicked.",
    metadata: { selector: "#payment-submit", confidence: 91 },
  },
  {
    id: "step-5",
    order: 5,
    title: "Verify confirmation",
    description: "Assert order confirmation page and order ID",
    status: "pending",
    reasoning:
      "Confirmation page rendered. Order ID ORD-2847 captured. Success banner visible.",
    metadata: {
      selector: "[data-testid='order-confirmation']",
      confidence: 98,
    },
  },
];

export const TIMELINE_CARDS = [
  {
    id: "tl-1",
    stepNumber: 1,
    title: "Clicked checkout CTA",
    description: "Agent navigated from cart to checkout flow",
    durationMs: 1240,
    confidence: 96,
    forkStepId: "step-1",
  },
  {
    id: "tl-2",
    stepNumber: 2,
    title: "Validated cart line items",
    description: "Confirmed product quantity and price breakdown",
    durationMs: 890,
    confidence: 94,
    forkStepId: "step-2",
    selfHealed: true,
  },
  {
    id: "tl-3",
    stepNumber: 3,
    title: "Coupon accepted",
    description: "WINTER20 applied successfully — 20% discount",
    durationMs: 2100,
    confidence: 94,
    forkStepId: "step-3",
  },
  {
    id: "tl-4",
    stepNumber: 4,
    title: "Waiting for payment modal",
    description: "Stripe Elements iframe detected and focused",
    durationMs: 3400,
    confidence: 91,
    forkStepId: "step-4",
  },
  {
    id: "tl-5",
    stepNumber: 5,
    title: "Payment confirmed",
    description: "Transaction succeeded — redirecting to confirmation",
    durationMs: 5200,
    confidence: 98,
    forkStepId: "step-5",
  },
];

export const FORK_PRESETS = [
  {
    name: "Expired Coupon",
    instruction: "Apply expired coupon instead",
    edgeCase: "Validate error message for expired WINTER19 code",
  },
  {
    name: "Invalid Card",
    instruction: "Use invalid card",
    edgeCase: "Assert Stripe decline error surfaces correctly",
  },
  {
    name: "Payment Timeout",
    instruction: "Simulate payment timeout",
    edgeCase: "Verify retry UI after 30s gateway timeout",
  },
];

export const METRICS_DEFAULTS = {
  rerunSavingsMs: 134000,
  branchCount: 0,
  replayDurationMs: 0,
};

export function cloneSteps(steps) {
  return steps.map((s) => ({ ...s, metadata: { ...s.metadata } }));
}

export function createBranchSteps(
  baseSteps,
  forkFromStepNumber,
  modifiedInstruction
) {
  const steps = cloneSteps(baseSteps);
  return steps.map((step) => {
    if (step.order < forkFromStepNumber) {
      return {
        ...step,
        status: "reused",
        timestamp: step.timestamp ?? "10:42:01",
      };
    }
    if (step.order === forkFromStepNumber) {
      return {
        ...step,
        status: "pending",
        reasoning: `Branch override: ${modifiedInstruction}`,
        timestamp: undefined,
        durationMs: undefined,
      };
    }
    return { ...step, status: "pending", timestamp: undefined };
  });
}
