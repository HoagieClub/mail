import Head from 'next/head';
import { UserProvider, useUser } from '@auth0/nextjs-auth0';
import { Alert, Pane } from 'evergreen-ui';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
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
                <Pane
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    marginTop={40}
                    marginBottom={-40}
                >
                    <Alert
                        intent="danger"
                        width={600}
                    >
                        <b>Please relogin to use the new Hoagie Mail. </b><br />
                        Our team added new ways to send messages and improved the
                        website! If were already logged in before the update, please
                        <u>
                            <b> <a href="/api/auth/logout">Click here to Logout</a> </b>
                        </u>
                        and relogin once to automatically update your account.
                    </Alert>
                </Pane>
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
