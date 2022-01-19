import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
export default handleAuth({
  async login(req, res) {
    try {
      // Pass custom parameters to login
      await handleLogin(req, res, {
        authorizationParams: {
          connection: 'Princeton-CAS'
        },
        returnTo: '/'
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  }
});