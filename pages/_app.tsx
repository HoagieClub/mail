import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import Theme from '../lib/hoagie-ui/Theme';
import { Pane, Alert, useTheme } from 'evergreen-ui';
import "../lib/hoagie-ui/theme.css"
import "./mail.css"
import './quill.snow.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const tabs = [
    {title: "Send Mail", href: "/app"},
    {title: "Add to Digest", href: "/"}
  ];

  return (
    <UserProvider>
      <Head>
        <title>Mail by Hoagie</title>
      </Head>
      <Theme palette="purple">
      <Layout name="mail" tabs={tabs}>
      <Pane
          display="flex"
          width="100%"
          justifyContent="center"
        >
          <Alert
            intent="danger"
            marginY={24}
            width="500px"
            title="Effective immediately: New content rules"
            marginBottom="-40px"
            >
           According to our survey, majority of students do not want to receive emails about lost and found items or items you are selling. Until we implement a digest system, you SHOULD NOT use Hoagie Mail to send emails about lost and found items or items you are selling. Violation of this rule will result
           in a ban. Thank you for your understanding.
        </Alert>
        </Pane>
      <Component {...pageProps} />
      <Footer />
      </Layout>
      </Theme>
    </UserProvider>
  );
}