import {
    Spinner, Button, Pane, Heading, Link, Alert, majorScale,
} from 'evergreen-ui';
import ErrorMessage from '@/components/ErrorMessage';
import ScheduledMailPane from '@/components/MailForm/ScheduledSend/ScheduledMailPane';

export default function ScheduledMailForm({
    errorMessage,
    loading,
    userScheduledMail,
    onDelete,
    onUpdate,
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
                    bundled into a Digest email. You can modify your scheduled
                    emails here.
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
                the content of your email or send it now, simply delete it
                and make a new request. Deleted emails will not be sent.
            </Alert>
            <ScheduledMailPane
                scheduledMail={userScheduledMail?.scheduledMail}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
            <br />
            <Link href="/app">
                <Button size="large" float="left">Back</Button>
            </Link>
        </Pane>
    )
}
