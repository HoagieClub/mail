'use client';

import { useState, useEffect } from 'react';

import { Spinner } from 'evergreen-ui';
import { useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';

import ErrorMessage from '@/components/ErrorMessage';
import MailForm from '@/components/MailForm';
import View from '@/components/View';

export default function Digest() {
    const { mutate } = useSWRConfig();
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error } = useSWR('/api/hoagie/stuff/user', fetcher);

    const addDigest = async (digestData) => {
        const response = await fetch('/api/hoagie/stuff/user', {
            body: JSON.stringify(digestData),
            method: 'POST',
        });

        if (!response.ok) {
            const errorJson = await response.json();
            const errorText = errorJson.error || 'Unknown error';
            setErrorMessage(`There was an issue with your digest: ${errorText}`);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else {
            setSuccess(true);
        }
    };

    const deleteDigest = async () => {
        setSuccess(false);
        setLoading(true);
        const response = await fetch('/api/hoagie/stuff/user', {
            body: null,
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(`There was an issue while performing the deletion. 
            ${errorText}`);
            setLoading(false);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        } else {
            // mutate causes useSWR to re-fetch the data,
            // allowing the form to be updated after the digest is deleted
            setLoading(false);
            mutate('/api/hoagie/stuff/user');
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

    // TODO: Handle error properly.
    if (!data) {
        return (
            <View>
                <Spinner />
            </View>
        );
    }
    if (error) {
        return (
            <View>
                <ErrorMessage
                    text='Some issue occured connecting
                to Hoagie Stuff Digest, try again later or contact hoagie@princeton.edu
                if it does not get resolved.'
                />
            </View>
        );
    }
    return (
        <MailForm
            success={success}
            onError={setErrorMessage}
            onSend={addDigest}
            errorMessage={errorMessage}
            isDigest
            loading={loading}
            digest={data}
            onDelete={deleteDigest}
        />
    );
}
