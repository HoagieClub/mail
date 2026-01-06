import {
    NextRequest,
    RequestInit,
} from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/server';

import { auth0 } from '@/lib/auth0';

async function handler(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const path = (await params).path.join('/');

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
        const accessToken = await auth0.getAccessToken();
        fetchReq.headers = {
            ...fetchReq.headers,
            Authorization: `Bearer ${accessToken.token}`,
        };
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return await proxyRequest(
        `${process.env.HOAGIE_API_URL}${path}/`,
        fetchReq
    );
}

async function proxyRequest(url: string, fetchReq: RequestInit) {
    try {
        const response = await fetch(url, fetchReq);

        if (!response.ok) {
            const responseJson = await response.json();
            const errorText = responseJson.error || 'An error occurred';
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
