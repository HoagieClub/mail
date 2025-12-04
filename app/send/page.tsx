'use client';

import { useState } from 'react';

import { toaster } from 'evergreen-ui';

import MailForm from '@/components/MailForm';

const clearLocalStorage = () => {
    localStorage.removeItem('mailBodyDelta');
    localStorage.removeItem('mailBody');
    localStorage.removeItem('mailHeader');
    localStorage.removeItem('mailSender');
    localStorage.removeItem('mailSchedule');
};

export default function Send() {
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const sendMail = async (mailData) => {
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
            clearLocalStorage();
        } else {
            toaster.success('Test email sent! Check your inbox.');
            clearLocalStorage();
        }
    };

    return (
        <MailForm
            success={success}
            onSend={sendMail}
            errorMessage={errorMessage}
            isDigest={false}
        />
    );
}
