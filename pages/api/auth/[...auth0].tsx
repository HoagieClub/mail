import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
export default handleAuth({
  async login(req, res) {
    try {
      // Pass custom parameters to login
      await handleLogin(req, res, {
        authorizationParams: {
          audience: 'https://hoagieauth', // or AUTH0_AUDIENCE
          // Add the `offline_access` scope to also get a Refresh Token
          connection: 'Princeton-CAS',
        },
        returnTo: '/app'
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  }
});