/**
 * @overview Global pane layout to be used in @/app/layout.tsx
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

import { ReactNode } from 'react';

import { Pane, useTheme } from 'evergreen-ui';

import Footer from '@/lib/hoagie-ui/Footer';

function Layout({ children }: { children: ReactNode }) {
    const theme = useTheme();
    return (
        <Pane
            display='flex'
            flexDirection='column'
            minHeight='100vh'
            background={theme.colors.blue100}
        >
            <Pane flex='1'>{children}</Pane>
            <Pane>
                <Footer />
            </Pane>
        </Pane>
    );
}

export default Layout;
