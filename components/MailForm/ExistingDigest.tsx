import {
    Button, Pane, Heading, Text, Alert, majorScale, Dialog, InfoSignIcon,
} from 'evergreen-ui';
import Link from 'next/link';
import { useState } from 'react';
import ErrorMessage from '../ErrorMessage';

export default function ExistingDigest({
    errorMessage,
    digest,
    onDelete,
}) {
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        title,
        category,
        description,
        user,
        tags,
    } = digest;
    return (
        <Pane>
            <Heading
                size={800}
                marginY={majorScale(2)}
            >Your Current Digest Message:
            </Heading>
            <ErrorMessage text={errorMessage} />
            <Text>
                This message will be included in the next Hoagie Stuff Digest.<br />
                Digest emails are sent
                <b> at noon every Tuesday, Thursday and Saturday</b>.
            </Text>
            <Pane
                marginTop={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="default"
            >
                <Pane margin={20} width="100%">
                    <Text><b>Title:</b> { title }</Text>
                    <br />
                    <Text><b>Category:</b> { category }</Text>
                    <br />
                    <Text><b>Tags:</b> { tags.join(', ') }</Text>
                    <br />
                    <Text><b>Contact:</b>  { user.email } </Text>
                    <br />
                    <br />
                    <Text><b>Description:</b>  </Text>
                    <br />
                    {/* eslint-disable-next-line max-len */}
                    <Text>{ description }</Text>
                </Pane>
            </Pane>
            <Alert
                intent="none"
                title="Want to include another message?"
                marginTop={20}
            >
                You can only have one digest email at a time. If you would like to
                make a new one or edit it, you will need to delete the current
                request and re-do it. After deletion, your current message will not
                be sent but you may create a new Digest Message to be sent in a future
            </Alert>
            <br />
            <Pane>
                <Button
                    onClick={() => setShowConfirm(true)}
                    size="large"
                    appearance="primary"
                    float="right"
                >
                    Delete
                </Button>
                <Link href="/app">
                    <Button size="large" float="left">Back</Button>
                </Link>
            </Pane>
            <br />
            <Dialog
                isShown={showConfirm}
                hasHeader={false}
                hasClose={false}
                onConfirm={async () => {
                    await onDelete();
                    setShowConfirm(false);
                }}
                onCloseComplete={() => setShowConfirm(false)}
                confirmLabel="I understand"
                intent="warning"
            >
                <Pane
                    marginTop={35}
                    marginBottom={20}
                    fontFamily="Nunito"
                    display="flex"
                    alignItems="center"
                >
                    <InfoSignIcon marginRight={10} />
                    Are you sure you want to delete your current
                    Hoagie Stuff Digest message?
                </Pane>
                <Text>
                    This action <b>cannot be undone</b>.
                </Text>
            </Dialog>
        </Pane>
    )
}
