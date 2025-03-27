import { createKindeAPI } from "@kinde/infrastructure";

export const workflowSettings = {
  id: "m2mTokenGeneration",
  name: "M2M custom claims",
  failurePolicy: {
    action: "stop",
  },
  trigger: "m2m:token_generation",
  bindings: {
    "kinde.m2mToken": {}, // required to modify M2M access token
    "kinde.fetch": {}, // Required for external API calls
    "kinde.env": {}, // required to access your environment variables
    url: {}, // required for url params
  },
};

export default async function handleM2M(event) {
  // Get a token for Kinde management API
  const kindeAPI = await createKindeAPI(event);

  // Call Kinde applications properties API
  const { data } = await kindeAPI.get({
    endpoint: `applications/${event.context.application.clientId}/properties`,
  });
  const { appProperties } = data;

  // Get the org code property to make the correlation
  const orgCode = appProperties.find((prop) => prop.key === "org_code");

  // Get org data from Kinde management API
  const { data: org } = await kindeAPI.get({
    endpoint: `organization?code=${orgCode.value}`,
  });

  // Use the data to set the org data on the M2M token
  kinde.m2mToken.setCustomClaim("orgName", org.name);
  kinde.m2mToken.setCustomClaim("orgCode", org.code);
}
