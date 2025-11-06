import { NextResponse, type NextRequest } from 'next/server';

import { auth0 } from '@/lib/auth0';

export async function proxy(request: NextRequest) {
    const authRes = await auth0.middleware(request);

    // Ensure your own middleware does not handle the `/auth` routes
    if (request.nextUrl.pathname.startsWith('/auth')) {
        return authRes;
    }

    // Allow access to public routes without requiring a session
    if (request.nextUrl.pathname === '/') {
        return authRes;
    }

    // Any route that gets to this point will be considered a protected route,
    // and require the user to be logged-in to be able to access it
    const { origin } = new URL(request.url);
    const session = await auth0.getSession(); // TODO: Pass request to getSession when supported

    // If the user does not have a session, redirect to login
    if (!session) {
        return NextResponse.redirect(
            `${origin}/auth/login?returnTo=${request.nextUrl.pathname}`
        );
    }

    // If a valid session exists, continue with the response from Auth0 middleware
    // You can also add custom logic here...
    return authRes;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
