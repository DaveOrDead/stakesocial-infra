export const workflowSettings = {
  id: "planSelection",
  name: "Plan selection",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:plan_selection",
  bindings: {
    "kinde.plan": {},
  },
};

export default async function Workflow(event) {
  console.log("planSelection", event);

  //    some code here to check if user can perform the plan change
  kinde.plan.denySelection("To move from Scale to Pro you first need to:", [
    "Turn off your MFA workflow",
    "Remove any advanced orgs",
  ]);
}
