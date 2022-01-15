// import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

// export default withApiAuthRequired(async function products(req, res) {
//   // If your Access Token is expired and you have a Refresh Token
//   // `getAccessToken` will fetch you a new one using the `refresh_token` grant
//   const { accessToken } = await getAccessToken(req, res);
//   await fetch(process.env.HOAGIE_API_URL + '/mail/send', {
//     method: "POST",
//     headers: {
//       ContentType: 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: req.body,
//   }).then(async (response) => {
//     const sendStatus = await response.text();
//     res.status(response.status).send(sendStatus);
//   }).catch(() => {
//     res.status(404).send("Hoagie API seems to be down. Please try again later.");
//   });
// });

import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async (req, res) => {
    const { accessToken } = await getAccessToken(req, res);
    let { query } = req.query

    console.log("Inside the query function");

    if (typeof query === 'string') {
        query = [query]
    }
    query = query.join('/')

    const fetchReq = req.method === 'GET' ? {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    } : {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: req.body,
    }

    await fetch(`${process.env.HOAGIE_API_URL}/${query}`, fetchReq)
        .then(async (response) => {
            console.log(JSON.stringify(response.json));
            if (response.status === 204) {
                res.send({})
            } else {
                const sendStatus = await response.text();
                res.status(response.status).send(sendStatus);
            }
        }).catch((e) => {
            res.status(404)
                .send(e.message);
        });
});