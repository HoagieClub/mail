import '@/lib/hoagie-ui/theme.css';
import '@/app/mail.css';
import '@/app/quill.snow.css';
import { ReactNode } from 'react';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Metadata } from 'next';

import Content from '@/app/Content';

import { hoagie } from './hoagie';

export const metadata: Metadata = {
    title: 'Mail by Hoagie',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(${hoagie.toString()})();`,
                    }}
                />
            </head>
            <UserProvider>
                <body>
                    <Content>{children}</Content>
                </body>
            </UserProvider>
        </html>
    );
}
