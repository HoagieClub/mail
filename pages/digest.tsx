import { useState, useEffect } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import router from 'next/router';
import { Spinner } from 'evergreen-ui';
import useSWR from 'swr';
import MailForm from '../components/MailForm';

export default withPageAuthRequired(() => {
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const fetcher = (url: string) => fetch(url).then((r) => r.json())
    const { data, error } = useSWR(
        '/api/hoagie/mail/digest',
        fetcher,
    )

    const addDigest = async (digestData) => {
        const response = await fetch('/api/hoagie/mail/digest', {
            body: JSON.stringify(digestData),
            method: 'POST',
        });

        if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(`There was an issue with your email. ${errorText}`);
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

    // TODO: Handle error properly.
    if (!data || error) {
        <Spinner />
    }

    return (
        <MailForm
            success={success}
            onError={setErrorMessage}
            onSend={addDigest}
            errorMessage={errorMessage}
            isDigest
            digest={data}
        />
    );
});
