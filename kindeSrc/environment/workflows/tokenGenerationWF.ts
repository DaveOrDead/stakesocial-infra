export const workflowSettings = {
  id: "tokenGeneration",
  name: "Token generation Workflow",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:tokens_generation",
  bindings: {},
};

export default async function Workflow(event) {
  console.log("token gen", event);
}
