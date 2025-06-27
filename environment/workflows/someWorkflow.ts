import {
  accessTokenCustomClaims,
  createKindeAPI,
  idTokenCustomClaims,
  type onUserTokenGeneratedEvent,
  type WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "userTokenGeneration",
  name: "Access token custom claims",
  failurePolicy: {
    action: "stop",
  },
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.idToken": {}, // required to modify ID token claims
    "kinde.accessToken": {}, // required to modify access token claims
    "kinde.fetch": {}, // Required for external API calls
    "kinde.env": {}, // required to access your environment variables
    "kinde.localization": {}, // required property
    "kinde.mfa": {}, // required property
    url: {}, // required for url params
  },
};

export default async function handleUserTokens(
  event: onUserTokenGeneratedEvent
) {
  const userId = event.context.user.id;

  const kindeAPI = await createKindeAPI(event);

  const { data: user } = await kindeAPI.get({
    endpoint: `user?id=${userId}&expand=organizations`,
  });

  const { organizations } = user;
  console.log("User organizations:", organizations);
  if (organizations && organizations.length > 0) {
    const organisationWithLogo =
      (await Promise.all(
        organizations?.map(async (org) => {
          const [{ data: properties }, { data: organisation }] =
            await Promise.all([
              kindeAPI.get({
                endpoint: `organizations/${org}/properties`,
              }),

              kindeAPI.get({
                endpoint: `organization?code=${org}`,
              }),
            ]);

          return {
            id: org,
            name: organisation.name,
            url: properties.properties?.find(
              (property) => property.key === "url"
            )?.value,
          };
        })
      )) || [];

    const idToken = idTokenCustomClaims<{
      organizations: typeof organisationWithLogo;
    }>();

    idToken.organizations = organisationWithLogo;
  }
}
