import { createAuth0 } from '@auth0/auth0-vue';

export default createAuth0({
  domain: 'dev-k4fhctws467co87d.us.auth0.com',
  clientId: '6GmU4txQuU8DMr1rEJx3bm24Nh2ajty7',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://artemk-portfolio.com'
  }
});