export const workflowSettings = {
  id: "planSelection",
  name: "Plan selection",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:plan_selection",
  bindings: {
    "kinde.planSelection": {},
  },
};

export default async function handlePasswordReset(event) {
  console.log("planSelection", event);
  kinde.planSelection.denyAccess("Nah mate");
  console.log("done");
}
