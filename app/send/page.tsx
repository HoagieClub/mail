'use client';

import { useState } from 'react';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { LinearProgress } from '@mui/material';
import { toaster } from 'evergreen-ui';


import MailForm from '@/components/MailForm';

export default withPageAuthRequired(() => {
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const sendMail = async (mailData) => {
        setLoading(true);
        try {
        const response = await fetch('/api/hoagie/mail/send', {
            body: JSON.stringify(mailData),
            method: 'POST',
        });

        if (!response.ok) {
            const errorJson = await response.json();
            const errorText = errorJson.error || 'Unknown error';
            setErrorMessage(`There was an issue with your email. ${errorText}`);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else if (mailData.schedule !== 'test') {
            setSuccess(true);
        } else {
            toaster.success('Test email sent! Check your inbox.');
        }
        } finally {
            setLoading(false); 
        }

    };

    return (
        <div>
            {/* Show loading bar while email is being sent */}
            {loading && (
                <LinearProgress
                    sx={{
                        width: '100%',
                        marginBottom: '1rem',
                    }}
                />
            )}

        <MailForm
            success={success}
            onError={setErrorMessage}
            onSend={sendMail}
            errorMessage={errorMessage}
            isDigest={false}
        />
        </div>
    );
});
