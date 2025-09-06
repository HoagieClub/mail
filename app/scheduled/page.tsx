'use client';

import { useState, useEffect } from 'react';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Spinner } from 'evergreen-ui';
import { useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';

import ErrorMessage from '@/components/ErrorMessage';
import ScheduledMailForm from '@/components/MailForm/ScheduledSend/ScheduledMailForm';
import View from '@/components/View';

export default withPageAuthRequired(() => {
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error } = useSWR('/api/hoagie/mail/scheduled/user', fetcher);

    const deleteScheduled = async (scheduleData) => {
        setLoading(true);
        const response = await fetch('/api/hoagie/mail/scheduled/user', {
            body: JSON.stringify(scheduleData),
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(errorText);
            setLoading(false);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else {
            // mutate causes useSWR to re-fetch the data,
            // allowing the form to be updated after the digest is deleted
            setErrorMessage('');
            setLoading(false);
            mutate('/api/hoagie/mail/scheduled/user');
        }
    };

    const updateScheduled = async (scheduleData) => {
        setLoading(true);
        const response = await fetch('/api/hoagie/mail/scheduled/user', {
            body: JSON.stringify(scheduleData),
            method: 'POST',
        });
        if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(errorText);
            setLoading(false);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else {
            // mutate causes useSWR to re-fetch the data,
            // allowing the form to be updated after the digest is deleted
            setErrorMessage('');
            setLoading(false);
            mutate('/api/hoagie/mail/scheduled/user');
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        if (queryParams.has('code')) {
            queryParams.delete('code');
            queryParams.delete('state');
            // TODO: add support for other params to persist using
            // queryParam.toString() or remove the queryParams method
            router.replace('/app');
        }
    }, [router]);

    if (!data) {
        return (
            <View>
                <Spinner />
            </View>
        );
    }
    // TODO: Handle error properly.
    if (error) {
        return (
            <View>
                <ErrorMessage
                    text='Some issue occured connecting
                to Hoagie Mail, try again later or contact hoagie@princeton.edu
                if it does not get resolved.'
                />
            </View>
        );
    }
    return (
        <View>
            <ScheduledMailForm
                errorMessage={errorMessage}
                loading={loading}
                userScheduledMail={data}
                onDelete={deleteScheduled}
                onUpdate={updateScheduled}
            />
        </View>
    );
});
