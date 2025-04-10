import {
  createKindeAPI,
  fetch,
  getEnvironmentVariable,
  onUserTokenGeneratedEvent,
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
  id: "userTokenGeneration",
  name: "Access token custom claims",
  trigger: WorkflowTrigger.UserTokenGeneration,
};

export default async function handleUserTokens(
  event: onUserTokenGeneratedEvent
) {
  // Get a token for Kinde management API
  const kindeAPI = await createKindeAPI(event);

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
    "kinde_internal_data_region_id",
    "kinde_internal_initial_plan_interest",
    "kinde_internal_employee_count",
  ];

  function extractMatchingProperties(
    properties: Array<{ key: string; value: string }>
  ) {
    return properties.reduce(
      (acc, prop) => {
        if (propertiesToGetValuesFor.includes(prop.key)) {
          acc[prop.key] = prop.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
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
    hubspot_owner_id: "andre@kinde.com",
    kinde_domain: org.handle,
    marketing_opt_in: true,
    utm_campaign: props.kp_org_utm_campaign,
    utm_content: props.kp_org_utm_content,
    utm_medium: props.kp_org_utm_medium,
    utm_source: props.kp_org_utm_source,
    utm_term: props.kp_org_utm_term,
    hs_google_click_id: props.kp_org_gclid,
    hs_facebook_click_id: props.kp_org_fbclid,
    data_region: props.kinde_internal_data_region_id,
    employee_count: props.kinde_internal_employee_count,
    headcount: props.kinde_internal_employee_count,
    plan_interest: props.kinde_internal_initial_plan_interest,
  };

  console.log({ hubspotProperties });

  const HUBSPOT_TOKEN = getEnvironmentVariable("HUBSPOT_TOKEN")?.value;

  const IS_CALL_HUBSPOT = getEnvironmentVariable("IS_CALL_HUBSPOT")?.value;

  if (IS_CALL_HUBSPOT) {
    console.log("Calling Hubspot API");
  } else {
    console.log("Not calling Hubspot API");
  }

  //   POST TO HUBSPOT API
  //   const { data: hubspotData } = await fetch(
  //     "https://api.hubapi.com/crm/v3/objects/contacts",
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${HUBSPOT_TOKEN}`,
  //       },
  //       method: "POST",
  //       body: {
  //         properties: hubspotProperties,
  //       },
  //     }
  //   );
  //   console.log({ hubspotData });
}
