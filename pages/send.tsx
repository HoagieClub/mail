import { useEffect, useState } from 'react';
import router from 'next/router';
import { withMockablePageAuthRequired } from '../mock/User';
import MailForm from '../components/MailForm';

export default withMockablePageAuthRequired(() => {
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const sendMail = async (mailData) => {
        const response = await fetch('/api/hoagie/mail/send', {
            body: JSON.stringify(mailData),
            method: 'POST',
        });

        if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(`There was an issue with your email. ${errorText}`);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else {
            setSuccess(true);
        }
    }
    const sendTestMail = async (mailData) => {
        const response = await fetch('/api/hoagie/mail/sendTestMail', {
            body: JSON.stringify(mailData),
            method: 'POST',
        });

        if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(`There was an issue with your email. ${errorText}`);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else {
            setSuccess(true);
        }
    }
    useEffect(() => {
        // eslint-disable-next-line no-restricted-globals
        const queryParams = new URLSearchParams(location.search)

        if (queryParams.has('code')) {
            queryParams.delete('code')
            queryParams.delete('state')
            // TODO: add support for other params to persist using
            // queryParam.toString() or remove the queryParams method
            router.replace('/app', undefined, { shallow: true })
        }
    }, [])
    return (
        <MailForm
            success={success}
            onError={setErrorMessage}
            onSend={sendMail}
            onTestSend={sendTestMail}
            errorMessage={errorMessage}
            isDigest={false}
        />
    );
});
