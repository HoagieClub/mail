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
            intent="warning"
            title="Hoagie Mail is possibly unavailable because of mail sending limtis."
            marginY={10}
            width="500px"
            marginBottom="-30px"
            >
          Because of overwhelming amount of users, we reached our daily limit and are waiting for it to be reset. We cannot accurately estimate when exactly the service will come back, but we expect it to be after around 3pm. Thank you for bearing with us as we work on improving the platform and preventing future errors.
        </Alert>
        </Pane>
      <Component {...pageProps} />
      <Footer />
      </Layout>
      </Theme>
    </UserProvider>
  );
}