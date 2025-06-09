export const workflowSettings = {
  id: "planCancellation",
  name: "Plan cancellation",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:plan_cancellation_request",
  bindings: {
    "kinde.plan": {},
  },
};

export default async function Workflow(event) {
  console.log("planCancellation", event);

  //    some code here to check if user can perform the plan change
  kinde.plan.denyCancellation("To move from Scale to Pro you first need to:");
}
