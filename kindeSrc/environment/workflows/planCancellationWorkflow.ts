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

  kinde.plan.denyCancellation(
    "Contact us via support and we will help you out."
  );
}
