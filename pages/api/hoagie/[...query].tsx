import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async (req, res) => {
    const { accessToken } = await getAccessToken(req, res);
    let { query } = req.query

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
