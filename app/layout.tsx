import '@/lib/hoagie-ui/theme.css';
import '@/app/mail.css';
import '@/app/quill.snow.css';
import { ReactNode } from 'react';

import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';

import Content from '@/app/Content';
import hoagie from '@/app/hoagie';
import { auth0 } from '@/lib/auth0';

export const metadata: Metadata = {
    title: 'Mail by Hoagie',
};

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth0.getSession();

    return (
        <html lang='en'>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(${hoagie.toString()})();`,
                    }}
                />
            </head>
            <Auth0Provider user={session?.user}>
                <body>
                    <Content>{children}</Content>
                </body>
            </Auth0Provider>
        </html>
    );
}
