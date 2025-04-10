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
  const HUBSPOT_TOKEN = getEnvironmentVariable("HUBSPOT_TOKEN")?.value;

  // Get a token for Kinde management API
  const kindeAPI = await createKindeAPI(event);

  // Call Kinde organizations  API
  const { data: org } = await kindeAPI.get({
    endpoint: `organization?code=${event.context.organization.code}`,
  });
  const { organization } = org;

  // call user api
  const { data: usr } = await kindeAPI.get({
    endpoint: `user?id=${event.context.user.id}`,
  });

  const { user } = usr;

  console.log({ organization, user });

  // POST TO HUBSPOT API
  // const { data: crmData } = await fetch(
  //   'https://api.hubapi.com/crm/v3/objects/contacts',
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${HUBSPOT_TOKEN}`,
  //     },
  //     method: "POST",
  //     body: JSON.stringify({
  //       properties: {
  //         email: event.user.email,
  //         firstname: event.user.firstName,
  //         lastname: event.user.lastName,
  //         hs_context: JSON.stringify(event),
  //         hs_analytics_source: "api",
  //         hs_analytics_source_data_1: event.user.email,
  //         hs_analytics_source_data_2: event.user.firstName,
  //         hs_analytics_source_data_3: event.user.lastName,
  //       },
  //     }),
  //   },
  // );

  // Contact Email
  // Company Name
  // Customer Status - Signed up
  // Data Region - 'au'

  // Email automation via - Apollo
  // Employee Count

  // First Name
  // Last Name

  // Headcount

  // Contact owner andre@kinde.com
  // Kinde Domain

  // Marketing Opt-in true
  // Plan interest

  // State/Region

  // UTM Campaign
  // UTM Content
  // UTM Medium
  // UTM Source
  // UTM Term
  // Website Domain

  // POST TO ORG ADDING CONTACT ID
}
