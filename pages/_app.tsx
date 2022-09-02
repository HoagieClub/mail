import Head from 'next/head';
import { UserProvider, useUser } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../lib/hoagie-ui/Footer';
import Theme from '../lib/hoagie-ui/Theme';
import Nav from '../lib/hoagie-ui/Nav';
import '../lib/hoagie-ui/theme.css'
import './mail.css'
import './quill.snow.css';

function Content({ Component, pageProps }) {
    const tabs = [
        { title: 'Send Mail', href: '/app' },
    ];
    const user = useUser();

    return (
        <Theme palette="orange">
            <Layout>
                <Nav name="mail" tabs={tabs} user={user} />
                <Component {...pageProps} />
                <Footer />
            </Layout>
        </Theme>
    );
}

export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <title>Mail by Hoagie</title>
            </Head>
            <Content Component={Component} pageProps={pageProps} />
        </UserProvider>
    );
}
