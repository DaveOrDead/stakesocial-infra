export const workflowSettings = {
  id: "postAuthWF",
  name: "Post-Auth Workflow",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:post_authentication",
  bindings: {},
};

export default async function Workflow(event) {
  console.log("postauth", event);
}
