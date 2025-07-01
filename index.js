```javascript
const zapier = require('zapier-platform-core');

const authentication = require('./authentication');
const triggers = require('./triggers');
const actions = require('./actions');
const searches = require('./searches');

const App = {
  version: require('./package.json').version,
  platformVersion: zapier.version,
  authentication: authentication,
  beforeRequest: [
    (request, z, bundle) => {
      if (bundle.authData.accessToken) {
        request.headers.Authorization = `Bearer ${bundle.authData.accessToken}`;
      }
      return request;
    },
  ],
  afterResponse: [
    (response, z, bundle) => {
      if (response.status === 401) {
        throw new z.errors.RefreshAuthError();
      }
      return response;
    },
  ],
  resources: {},
  triggers: triggers,
  actions: actions,
  searches: searches,
  onAppEvent: {
    [z.common.events.AUTHENTICATION_TEST]: [
      async (z, bundle) => {
        const response = await z.request({ url: '/api/user' });
        if (response.status !== 200) {
          throw new Error('Invalid credentials');
        }
      },
    ],
  },
};

module.exports = App;
```

Please note that this is a basic structure of a Zapier CLI application. The actual implementation of `authentication`, `triggers`, `actions`, and `searches` would require separate JavaScript files and would depend on the specific APIs of the integrated platforms (Salesforce, HubSpot, Shopify, Stripe, Google Analytics, and social media platforms). The `beforeRequest` and `afterResponse` methods are used for adding the access token to each request and handling authentication errors, respectively. The `onAppEvent` method is used for testing the authentication during the setup of the Zap.