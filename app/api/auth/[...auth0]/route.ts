/**
 * @overview Auth0 route handler file that creates the following routes:
 * - /api/auth/login
 * - /api/auth/logout
 * - /api/auth/callback
 * - /api/auth/me
 *
 * Copyright © 2021-2024 Hoagie Club and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree or at https://github.com/HoagieClub/mail/blob/main/LICENSE.
 *
 * Permission is granted under the MIT License to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the software. This software is provided "as-is", without warranty of any kind.
 */

import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

/**
 * Handles authentication requests.
 *
 * @returns A NextResponse object with the API response.
 */
export const GET = handleAuth({
    async login(req, res) {
        try {
            // Pass custom parameters to login
            return await handleLogin(req, res, {
                authorizationParams: {
                    audience: 'https://hoagieauth', // or AUTH0_AUDIENCE
                    // Add the `offline_access` scope to also get a Refresh Token
                    connection: 'Princeton-CAS',
                },
                returnTo: '/app',
            });
        } catch (error:any) {
            res.status(error.status || 400).end(error.message);
        }
    },
});
