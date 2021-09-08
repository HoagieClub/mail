import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import Theme from '../lib/hoagie-ui/Theme';
import { Pane, Alert } from 'evergreen-ui';
import "../lib/hoagie-ui/theme.css"
import "./mail.css"
import './quill.snow.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
        <Head>
        <title>Mail by Hoagie</title>
      </Head>
      <Theme>
      <Layout name="mail">
      <Pane
          display="flex"
          width="100%"
          justifyContent="center"
        >
          <Alert
            intent="info"
            title="Hoagie Mail was not working for some time. It is back up now."
            marginY={10}
            width="500px"
            marginBottom="-30px"
            >
          Because of overwhelming amount of users, the platform malfunctioned earlier today. If you have sent an email between 7pm on September 7th and 4pm on September 8th and never received anything, you may need to resend it. We fixed the issue now; thank you for bearing with us as the platform is early in its production.
        </Alert>
        </Pane>
      <Component {...pageProps} />
      <Footer />
      </Layout>
      </Theme>
    </UserProvider>
  );
}