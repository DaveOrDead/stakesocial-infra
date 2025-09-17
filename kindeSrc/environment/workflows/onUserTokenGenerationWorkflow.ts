import {hello} from "./hello";

export const workflowSettings = {
  id: "addUserTokenClaim",
  trigger: "user:tokens_generation",
  bindings: {
    console: {},
    "kinde.fetch": {},
    "kinde.idToken": {
      resetClaims: true,
    },
    "kinde.accessToken": {
      resetClaims: true,
    },
    "kinde.ssoSession": {}
  },
};

export default async function handlePreMFA({request, context}) {
    // const res = await kinde.fetch("https://api.stakesocial.com/v1/get_sports", {
    //   method: "GET",
    //   responseFormat: "json",
    // });
  console.log('hello world');
  const policy = 'non_persistent';
kinde.ssoSession.setPolicy(policy);
  console.log('running');
    // console.log("stakeRes", res);
    // kinde.accessToken.setCustomClaim("sport", res.json.data[0].name);
    // console.log({ request, context });
    // kinde.idToken.setCustomClaim("sport", res.json.data[1].name);
    // kinde.accessToken.setCustomClaim("dave", "and_daniel_is_cool");
    // return "testing add user tokens claim";
};
