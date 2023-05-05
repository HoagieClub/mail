import {
    Spinner, Button, Pane, Heading, Link, Text, Paragraph,
    Alert, majorScale, Dialog, InfoSignIcon,
} from 'evergreen-ui';
// import Link from 'next/link';
// import { useState } from 'react';
import SuccessPage from '../SuccessPage';
import ErrorMessage from '../../ErrorMessage';
import ScheduledMailPane from './ScheduledMailPane';

export default function ScheduledMailForm({
    onError, errorMessage,
    userScheduledMail,
    loading,
}) {
    if (userScheduledMail?.status === 'unused') {
        return (
            <Pane>
                <Heading
                    size={800}
                    marginY={majorScale(2)}
                >No Scheduled Emails
                </Heading>
                <ErrorMessage text={errorMessage} />
                <Alert
                    intent="none"
                >
                    Emails relating to University Clubs, Departments, and Organizations
                    can be scheduled up to four days in advance. Other emails will be
                    bundled into a Digest email.
                </Alert>
                <br />
                <Link href="/app">
                    <Button size="large" float="left">Send an email</Button>
                </Link>
            </Pane>
        )
    }
    if (loading || !userScheduledMail?.scheduledMail) {
        return <Spinner />
    }
    return (
        <Pane>
            <Heading
                size={800}
                marginY={majorScale(2)}
            >Your Scheduled Emails
            </Heading>
            <ErrorMessage text={errorMessage} />
            <Alert
                intent="none"
            >
                Reschedule your scheduled emails or delete them here. To change
                the content of your email, simply delete it and send a new one.
                Deleted emails will not be sent.
            </Alert>
            <ScheduledMailPane
                scheduledMail={userScheduledMail?.scheduledMail}
            />
        </Pane>
    )
}
