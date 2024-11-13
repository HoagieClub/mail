import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../lib/hoagie-ui/Footer';
import Theme from '../lib/hoagie-ui/Theme';
import Nav from '../lib/hoagie-ui/Nav';
import '../lib/hoagie-ui/theme.css'
import './mail.css'
import './quill.snow.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { getSession } from '@auth0/nextjs-auth0';

export const metadata: Metadata = {
    title: 'Mail by Hoagie'
}

async function Content({ children }: { children: ReactNode }): Promise<JSX.Element> {
    const tabs = [
        { title: 'Send Mail', href: '/app' },
        { title: 'Scheduled Emails', href: '/scheduled' },
        { title: 'Current Digest', href: '/digest?type=current' },
    ];

    const session = await getSession();
    const user = session?.user;

    return (
        <Theme palette="orange">
            <Layout>
                <Nav name="mail" tabs={tabs} user={user} />
                {children}
                <Footer />
            </Layout>
        </Theme>
    );
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <UserProvider>
                <body>
                    <Content>{children}</Content>
                </body>
            </UserProvider>
        </html>
    );
}
