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
            title="Please limit your use of Hoagie Mail for non-urgent manners."
            marginY={10}
            width="500px"
            marginBottom="-30px"
            >
          <b>We still have a daily limit in place for mail sending. For the time being, please do not use the platform for personal or non-urgent emails for the time being to allow clubs to advertise upcoming events. </b> Thank you for bearing with us as the platform is early in its production.
        </Alert>
        </Pane>
      <Component {...pageProps} />
      <Footer />
      </Layout>
      </Theme>
    </UserProvider>
  );
}