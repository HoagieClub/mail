import {
    Button, Pane, Heading, Text, Alert,
    majorScale, Dialog, InfoSignIcon, Spinner,
} from 'evergreen-ui';
import Link from 'next/link';
import { useState } from 'react';
import SuccessPage from '../SuccessPage';
import ExistingDigest from '../ExistingDigest';
import ErrorMessage from '../../ErrorMessage';
import { GenericForm, LostAndFoundForm, SaleForm } from './Forms';

export default function DigestForm({
    onSend,
    errorMessage,
    success,
    digest,
    onDelete,
}) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [desc, setDesc] = useState('')
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    // eslint-disable-next-line no-restricted-globals
    const queryParams = new URLSearchParams(location.search)
    const category = queryParams.has('type') ? queryParams.get('type') : 'bulletin';

    const categoryDefaults = {
        sale: [],
        lost: ['lost'],
        selling: [],
        bulletin: ['announcement'],
    }
    const [tags, setTags] = useState(categoryDefaults[category])
    if (digest.status === 'used') {
        return (
            <ExistingDigest
                errorMessage={errorMessage}
                digest={digest}
                onDelete={onDelete}
            />
        );
    }
    if (!digest.status) {
        return <Spinner />;
    }
    const Form = (
        <Pane>
            <Heading
                size={800}
                marginY={majorScale(2)}
            >Send an Email
            </Heading>
            <ErrorMessage text={errorMessage} />
            <Alert
                intent="none"
                title="This message will be sent through the Hoagie Stuff Digest service."
            >
                Your message will be bundled with others in a weekly digest email.
                Digest emails are sent at noon every Tuesday, Thursday and Saturday.
            </Alert>
            <br />
            {
                category === 'sale' && (
                    <SaleForm
                        desc={desc}
                        link={link}
                        setDesc={setDesc}
                        setLink={setLink}
                        setTags={setTags}
                    />
                )
            }
            {
                category === 'lost' && (
                    <LostAndFoundForm
                        name={name}
                        desc={desc}
                        thumbnail={link}
                        setName={setName}
                        setDesc={setDesc}
                        setThumbnail={setLink}
                        setTags={setTags}
                    />
                )
            }
            {
                category === 'bulletin' && (
                    <GenericForm
                        name={name}
                        desc={desc}
                        setName={setName}
                        setDesc={setDesc}
                        setTags={setTags}
                    />
                )
            }
            <Pane
                paddingTop={20}
            >
                <Button
                    onClick={() => setShowConfirm(true)}
                    size="large"
                    appearance="primary"
                    float="right"
                >
                    Submit
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
                    await onSend({
                        title: name,
                        description: desc,
                        category,
                        link,
                        tags,
                    });
                    setShowConfirm(false);
                }}
                onCloseComplete={() => setShowConfirm(false)}
                confirmLabel="Add Message"
                intent="warning"
            >
                <Pane
                    marginTop={35}
                    marginBottom={20}
                    display="flex"
                    alignItems="center"
                >
                    <InfoSignIcon marginRight={10} />
                    You are about to add your message
                    to the weekly Hoagie Mail Digest service.
                </Pane>
                <Text>
                    Once you click <b>Submit</b>, Hoagie will append your
                    message in the upcoming weekly digest email.
                    This is sent to
                    <b> all residential college listservs on your behalf</b>.
                    Your NetID will be included with your message regardless
                    of the content.
                </Text>
                <Alert
                    intent="warning"
                    title="Use this tool responsibly"
                    marginTop={20}
                >
                    If Hoagie Stuff Digest is used to send offensive,
                    intentionally misleading or harmful messages,
                    the user will be banned from the platform
                    and, if necessary, reported to the University.
                </Alert>
            </Dialog>
        </Pane>
    )
    return success ? <SuccessPage digest /> : Form;
}
