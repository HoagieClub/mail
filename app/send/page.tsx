'use client';

import { useEffect, useState } from 'react';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { toaster } from 'evergreen-ui';

import MailForm from '@/components/MailForm';

export default withPageAuthRequired(() => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
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
        } else if (mailData.schedule !== 'test') {
            setSuccess(true);
        } else {
            toaster.success('Test email sent! Check your inbox.');
        }
    };

    return (
        <MailForm
            success={success}
            onError={setErrorMessage}
            onSend={sendMail}
            errorMessage={errorMessage}
            isDigest={false}
        />
    );
});
