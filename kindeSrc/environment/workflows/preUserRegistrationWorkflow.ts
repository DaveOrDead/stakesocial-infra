export const workflowSettings = {
  id: "preUserRegistrationWF",
  name: "Pre User Registration Workflow",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:pre_registration",
  bindings: {},
};

export default async function Workflow(event) {
  console.log("planSelection", event);
}
