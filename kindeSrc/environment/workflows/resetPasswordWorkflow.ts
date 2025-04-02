import {
  WorkflowTrigger,
  onNewPasswordProvidedEvent,
  getEnvironmentVariable,
  secureFetch,
} from "@kinde/infrastructure";

export const workflowSettings = {
  id: "passwordReset",
  name: "Reset password",
  failurePolicy: {
    action: "continue",
  },
  trigger: WorkflowTrigger.NewPasswordProvided,
  bindings: {
    "kinde.env": {}, // required to access your environment variables
    "kinde.secureFetch": {}, // Required for external API calls
  },
};

export default async function handlePasswordReset(
  event: onNewPasswordProvidedEvent
) {
  console.log("handlePasswordReset", event);
  try {
    const KINDE_WEBHOOK_URL =
      getEnvironmentVariable("KINDE_WEBHOOK_URL")?.value;
    if (!KINDE_WEBHOOK_URL) {
      throw Error("Endpoint not set");
    }

    console.log("KINDE_WEBHOOK_URL", KINDE_WEBHOOK_URL);

    // The payload you want to send
    const payload = {
      type: "new_password_provided",
      user: event.context.user,
      newPasswordReason: event.context.auth.newPasswordReason,
    };

    const response = await secureFetch(KINDE_WEBHOOK_URL, {
      method: "POST",
      responseFormat: "json",
      headers: {
        "content-type": "application/json",
      },
      body: payload,
    });

    console.log("response", response);
  } catch (error) {
    console.error("error", error);
  }

  console.log("done");
}
