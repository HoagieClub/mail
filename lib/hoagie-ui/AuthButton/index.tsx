/**
 * @overview AuthButton component for the HoagieMail app.
 *
 * Copyright © 2021-2024 Hoagie Club and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree or at https://github.com/HoagieClub/mail/blob/main/LICENSE.
 *
 * Permission is granted under the MIT License to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the software. This software is provided "as-is", without warranty of any kind.
 */

'use client';

import { Button, Pane, majorScale, minorScale } from 'evergreen-ui';

interface AuthButtonProps {
    /** defines whether the button is for "login" or "logout" */
    variant?: string;
    /** optional custom url to direct; uses API endpoints by default */
    href?: string;
}

/** AuthButton is a button meant for logins and logout throughout
 * different Hoagie applications.
 */
function AuthButton({ variant = 'login', href = '' }: AuthButtonProps) {
    const logo = (
        <h2
            style={{
                fontSize: '28px',
                paddingRight: 16,
            }}
            className='hoagie'
        >
            h
        </h2>
    );
    const isLogout = variant === 'logout';
    const defHref = isLogout ? '/api/auth/logout' : '/api/auth/login';

    return (
        <a href={href === '' ? defHref : href}>
            <Button
                height={56}
                width={majorScale(35)}
                background='purple600'
                appearance={isLogout ? 'default' : 'primary'}
            >
                {logo}
                <Pane display='flex'>
                    {isLogout ? 'Logout from' : 'Login using'}
                    <Pane marginLeft={minorScale(1)} className='hoagie'>
                        hoagie<b>profile</b>
                    </Pane>
                </Pane>
            </Button>
        </a>
    );
}

export default AuthButton;
