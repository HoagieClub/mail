import { getAccessToken } from '@auth0/nextjs-auth0';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export default async (req, res) => {
    let { path } = req.query

    if (typeof path === 'string') {
        path = [path]
    }
    path = path.join('/')

    delete req.query.path;
    const qs = Object.keys(req.query).map((key) => `${key}=${req.query[key]}`).join('&');
    const queryString = qs === '' ? '' : `?${qs}`;

    const fetchReq: RequestInit = {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
        },
    }

    if (req.method !== 'GET') {
        fetchReq.body = req.body;
    }

    if (process.env.NODE_ENV === 'development') {
        await fetch(`${process.env.HOAGIE_API_URL}/${path}${queryString}`, fetchReq)
            .then(async (response) => {
                if (!response.ok) {
                    res.status(response.status).send(await response.text())
                } else if (response.status === 204) {
                    res.send({})
                } else {
                    const sendStatus = await response.json();
                    res.status(response.status).send(sendStatus);
                }
            }).catch((e) => {
                res.status(404)
                    .send(e.message);
            })
        return;
    }

    const { accessToken } = await getAccessToken(req, res);
    // @ts-expect-error - Headers is not defined in the type definition for RequestInit
    fetchReq.headers.Authorization = `Bearer ${accessToken}`;

    await fetch(`${process.env.HOAGIE_API_URL}${path}`, fetchReq)
        .then(async (response) => {
            if (!response.ok) {
                res.status(response.status).send(await response.text())
            } else if (response.status === 204) {
                res.send({})
            } else {
                const sendStatus = await response.json();
                res.status(response.status).send(sendStatus);
            }
        }).catch((e) => {
            res.status(404)
                .send(e.message);
        });
};
