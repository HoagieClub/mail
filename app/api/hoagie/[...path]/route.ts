import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import {
    NextRequest,
    RequestInit,
} from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';

type Params = { path: string[] };

const handler = withApiAuthRequired(
    async (request: NextRequest, { params }: { params: Params }) => {
        const path = params.path.join('/');

        const fetchReq: RequestInit = {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (request.method !== 'GET') {
            fetchReq.body = await request.text();
        }

        try {
            const { accessToken } = await getAccessToken();
            fetchReq.headers = {
                ...fetchReq.headers,
                Authorization: `Bearer ${accessToken}`,
            };
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return await proxyRequest(
            `${process.env.HOAGIE_API_URL}${path}`,
            fetchReq
        );
    }
);

async function proxyRequest(url: string, fetchReq: RequestInit) {
    try {
        const response = await fetch(url, fetchReq);

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText },
                { status: response.status }
            );
        } else if (response.status === 204) {
            return NextResponse.json({}, { status: 204 });
        } else {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
}

// Delegate all http requests to the handler
export const GET = handler;
export const POST = handler;
export const DELETE = handler;
