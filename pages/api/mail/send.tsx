import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function products(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const { accessToken } = await getAccessToken(req, res);
  await fetch('http://localhost:8080/mail/send', {
    method: "POST",
    headers: {
      ContentType: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: req.body,
  }).then(async (response) => {
    const sendStatus = await response.text();
    res.status(response.status).send(sendStatus);
  }).catch(() => {
    res.status(404).send("Hoagie API seems to be down. Please try again later.");
  });
});