import { onUserPreMFA } from "@kinde/infrastructure";
import {
  createKindeAPI,
  fetch,
  getEnvironmentVariable,
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  bindings: {
    "kinde.env": {},
    "kinde.fetch": {},
    url: {},
  },
  failurePolicy: {
    action: "continue",
  },
  id: "hubspotSync",
  name: "HubSpot sync - pre MFA s",
  trigger: WorkflowTrigger.UserPreMFA,
};

export default async function handleUserTokens(event: onUserPreMFA) {
  // Get a token for Kinde management API
  const kindeAPI = await createKindeAPI(event);
  console.log("event", event);
  // Call Kinde organizations  API
  const { data: org } = await kindeAPI.get({
    endpoint: `organization?code=${event.context.organization.code}`,
  });

  const now = new Date();
  const createdOn = new Date(org.created_on);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

  if (createdOn < fiveMinutesAgo) {
    console.log(
      "Organization was not created within last 5 minutes, skipping Hubspot sync"
    );
    return;
  }

  const IS_HUBSPOT_DEBUG_MODE = Boolean(
    getEnvironmentVariable("IS_HUBSPOT_DEBUG_MODE")?.value
  );

  // Call Kinde organization properties API
  const { data } = await kindeAPI.get({
    endpoint: `organizations/${event.context.organization.code}/properties`,
  });
  const { properties } = data;

  const propertiesToGetValuesFor = [
    "kp_org_utm_source",
    "kp_org_utm_medium",
    "kp_org_utm_campaign",
    "kp_org_utm_content",
    "kp_org_utm_term",
    "kp_org_gclid",
    "kp_org_fbclid",
    "kinde_internal_assigned_region",
    "kinde_internal_initial_plan_interest",
  ];

  function extractMatchingProperties(
    properties: Array<{ key: string; value: string }>
  ) {
    return properties.reduce((acc, prop) => {
      if (propertiesToGetValuesFor.includes(prop.key)) {
        acc[prop.key] = prop.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  const props = extractMatchingProperties(properties);

  // call user api
  const { data: user } = await kindeAPI.get({
    endpoint: `user?id=${event.context.user.id}`,
  });

  const hubspotProperties = {
    email: user.preferred_email,
    company: org.name,
    customer_status: "Signed up",
    email_automation_via: "Apollo",
    firstname: user.first_name,
    lastname: user.last_name,
    hubspot_owner_id: getEnvironmentVariable("HUBSPOT_CONTACT_OWNER_ID")?.value,
    kinde_domain: org.handle,
    marketing_opt_in: true,
    utm_campaign: props.kp_org_utm_campaign,
    utm_content: props.kp_org_utm_content,
    utm_medium: props.kp_org_utm_medium,
    utm_source: props.kp_org_utm_source,
    utm_term: props.kp_org_utm_term,
    hs_google_click_id: props.kp_org_gclid,
    hs_facebook_click_id: props.kp_org_fbclid,
    data_region: props.kinde_internal_assigned_region,
    plan_interest: props.kinde_internal_initial_plan_interest,
  };

  if (IS_HUBSPOT_DEBUG_MODE) {
    console.log({ hubspotProperties });
  }

  const HUBSPOT_TOKEN = getEnvironmentVariable("HUBSPOT_TOKEN")?.value;

  const IS_CALL_HUBSPOT = getEnvironmentVariable("IS_CALL_HUBSPOT")?.value;

  if (IS_CALL_HUBSPOT === "true") {
    if (IS_HUBSPOT_DEBUG_MODE) {
      console.log("Calling Hubspot API");
    }
    const { data: hubspotData } = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        },
        method: "POST",
        body: {
          properties: hubspotProperties,
        },
      }
    );
    if (IS_HUBSPOT_DEBUG_MODE) {
      console.log({ hubspotData });
    }
  } else {
    console.log(
      "Env variable 'IS_CALL_HUBSPOT' is false - not calling Hubspot API"
    );
  }
}
