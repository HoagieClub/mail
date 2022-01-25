import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import Theme from '../lib/hoagie-ui/Theme';
import '../lib/hoagie-ui/theme.css'
import './mail.css'
import './quill.snow.css';

export default function App({ Component, pageProps }) {
    const tabs = [
        { title: 'Send Mail', href: '/app' },
    ];

    return (
        <UserProvider>
            <Head>
                <title>Mail by Hoagie</title>
            </Head>
            <Theme palette="orange">
                <Layout name="mail" tabs={tabs}>
                    <Component {...pageProps} />
                    <Footer />
                </Layout>
            </Theme>
        </UserProvider>
    );
}
