import {
  createKindeAPI,
  fetch,
  getEnvironmentVariable,
  WorkflowSettings,
  WorkflowTrigger,
  version,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "postAuthWF",
  name: "Post-Auth Workflow",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:post_authentication",
  bindings: {
    "kinde.env": {},
    "kinde.fetch": {},
    url: {},
  },
};

export default async function Workflow(event) {
  console.log("postauth", event);

  const kindeAPI = await createKindeAPI(event);

  const { clientId } = event.context.application;
  console.log({ version });
  // Call Kinde applications properties API
  const { data } = await kindeAPI.get({
    endpoint: `applications/${clientId}/properties`,
  });
  const { appProperties } = data;
}
