'use client';

import { ReactNode } from 'react';

import { useUser } from '@auth0/nextjs-auth0/client';

import Layout from '@/lib/hoagie-ui/Layout';
import Nav from '@/lib/hoagie-ui/Nav';
import Theme from '@/lib/hoagie-ui/Theme';

export default function Content({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const tabs = [
        { title: 'Send Mail', href: '/app' },
        { title: 'Scheduled Emails', href: '/scheduled' },
        { title: 'Current Digest', href: '/digest?type=current' },
    ];

    const user = useUser();

    return (
        <Theme palette='orange'>
            <Layout>
                <Nav name='mail' tabs={tabs} user={user?.user} />
                {children}
            </Layout>
        </Theme>
    );
}
