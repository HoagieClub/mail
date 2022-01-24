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

    if (digest.Status === 'used') {
        return <ExistingDigest errorMessage={errorMessage} digest={digest} onDelete={onDelete}/>;
    }
    if (!digest.Status) {
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
                title="This message will be sent through the hoagiemail digest service."
            >
                Your message will be bundled with others in a weekly digest email.
                Earliest possible time this will be sent is at 12pm Jan 20th, 2021.
            </Alert>
            <br />
            {
                queryParams.get('type') === 'sale' && (
                    <SaleForm
                        name={name}
                        desc={desc}
                        link={link}
                        setName={setName}
                        setDesc={setDesc}
                        setLink={setLink}
                    />
                )
            }
            {
                queryParams.get('type') === 'lost' && (
                    <LostAndFoundForm
                        name={name}
                        desc={desc}
                        thumbnail={link}
                        setName={setName}
                        setDesc={setDesc}
                        setThumbnail={setLink}
                    />
                )
            }
            {
                (queryParams.get('type') === 'misc'
                || !queryParams.has('type')
                ) && (
                    <GenericForm
                        name={name}
                        desc={desc}
                        setName={setName}
                        setDesc={setDesc}
                    />
                )
            }
            <Pane>
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
                        category: 'Lost and found',
                        link,
                    });
                    setShowConfirm(false);
                }}
                onCloseComplete={() => setShowConfirm(false)}
                confirmLabel="Send Email"
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
                    You are about to add your message
                    to the weekly Hoagie Mail Digest service.
                </Pane>
                <Text>
                    Once you click <b>Submit</b>, Hoagie will append your
                    message in the upcoming weekly digest email.
                    This is sent to
                    <b>all residential college listservs on your behalf</b>.
                    Your NetID will be included with your message regardless
                    of the content.
                </Text>
                <Alert
                    intent="warning"
                    title="Use this tool responsibly"
                    marginTop={20}
                >
                    If Hoagie Mail Digest is used to send offensive,
                    intentionally misleading or harmful messages,
                    the user will be banned from the platform
                    and, if necessary, reported to the University.
                </Alert>
            </Dialog>
        </Pane>
    )
    return success ? <SuccessPage /> : Form;
}
