import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Theme from '../lib/hoagie-ui/Theme';
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
      <Component {...pageProps} />
      </Layout>
      </Theme>
    </UserProvider>
  );
}