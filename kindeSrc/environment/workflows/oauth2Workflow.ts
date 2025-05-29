export const workflowSettings = {
  id: "tokenExchange",
  name: "OAuth 2.0 token exchange",
  failurePolicy: {
    action: "continue",
  },
  trigger: "user:oauth2_token_exchange",
  bindings: {
    "kinde.accessToken": {},
  },
};

export default async function Workflow(event) {
  console.log("event", event);
  kinde.accessToken.setCustomClaim("random", event.context.oauth2.expiry);
}
