import {
  onUserPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
  denyAccess,
  getEnvironmentVariable,
} from "@kinde/infrastructure";

// The settings for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "postAuth",
  name: "Post auth",
  failurePolicy: {
    action: "stop",
  },
  trigger: WorkflowTrigger.PostAuthentication
  bindings: {},
};

// The workflow code to be executed when the event is triggered
export default async function handlePostAuthentication(
  event: onUserPostAuthenticationEvent
) {
  console.log("handlePostAuthentication", event);
}
