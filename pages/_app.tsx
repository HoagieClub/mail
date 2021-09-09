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
            title="Mail sending limits should be lifted now."
            marginY={10}
            width="500px"
            marginBottom="-30px"
            >
            We changed our mail service which has allowed us to significantly increase our daily limit. You may use the platform as normal now. If you notice any issues with the new service, please contact us.
        </Alert>
        </Pane>
      <Component {...pageProps} />
      <Footer />
      </Layout>
      </Theme>
    </UserProvider>
  );
}