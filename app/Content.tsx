'use client';

import { ReactNode } from 'react';

import { useUser } from '@auth0/nextjs-auth0';

import Layout from '@/lib/hoagie-ui/Layout';
import Nav, { type TabType } from '@/lib/hoagie-ui/Nav';
import Theme from '@/lib/hoagie-ui/Theme';

export default function Content({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const tabs: TabType[] = [
        { title: 'About', href: '/about' },
        { title: 'Scheduled Emails', href: '/scheduled', purpose: 'secondary' },
        {
            title: 'Current Digest',
            href: '/digest?type=current',
            purpose: 'secondary',
        },
        { title: 'Send Mail', href: '/app', purpose: 'primary' },
    ];

    const { user } = useUser();

    return (
        <Theme palette='orange-light'>
            <Layout>
                <Nav name='mail' tabs={tabs} user={user ?? undefined} />
                {children}
            </Layout>
        </Theme>
    );
}
