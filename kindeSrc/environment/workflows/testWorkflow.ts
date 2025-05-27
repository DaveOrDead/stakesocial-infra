export const workflowSettings = {
  id: "planSelection",
  name: "Plan selection",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:plan_selection",
};

export default async function handlePasswordReset(event) {
  console.log("planSelection", event);

  console.log("done");
}
