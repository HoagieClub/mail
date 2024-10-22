/**
 * @overview Root layout component for the template app. Styles apply to all children.
 *
 * Copyright © 2021-2024 Hoagie Club and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree or at https://github.com/hoagieclub/template/LICENSE.
 *
 * Permission is granted under the MIT License to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the software. This software is provided "as-is", without warranty of any kind.
 */

import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';

import Layout from '@/lib/hoagie-ui/Layout';
import Nav from '@/lib/hoagie-ui/Nav';
import Footer from '@/lib/hoagie-ui/Footer';
import Theme from '@/lib/hoagie-ui/Theme';
import { Toaster } from '@/components/ui/sonner';
import '@/lib/hoagie-ui/Theme/theme.css';
import './globals.css';
import './mail.css'
import './quill.snow.css';

export const metadata = {
  title: 'Hoagie by Hoagie',
  description: 'Build the next big thing.',
};

interface ContentProps {
  children: ReactNode;
}

/**
 * Content Component
 * Fetches user data (real or mock) and renders the main layout.
 *
 * @param children - The child components to render within the layout.
 * @returns JSX Element representing the content area.
 */
async function Content({ children }: ContentProps): Promise<JSX.Element> {
  const session = await getSession();
  const user = session?.user;

  const tabs = [
        { title: 'Send Mail', href: '/app' },
        { title: 'Scheduled Emails', href: '/scheduled' },
        { title: 'Current Digest', href: '/digest?type=current' },
    ];

  return (
    <Theme palette='purple'>
      <Layout>
        <Nav name='template' tabs={tabs} user={user} />
        {children}
        <Toaster />
        <Footer />
      </Layout>
    </Theme>
  );
}

/**
 * RootLayout Component
 * Wraps the entire application with necessary providers and layouts.
 *
 * @param children - The child components to render within the layout.
 * @returns JSX Element representing the root HTML structure.
 */
export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang='en'>
      <UserProvider>
        <body className='antialiased'>
          <Content>{children}</Content>
          <Analytics />
          <SpeedInsights />
        </body>
      </UserProvider>
    </html>
  );
}
