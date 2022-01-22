import {
    Button, Pane, Heading, Text, Alert, majorScale, TextInputField, Dialog, InfoSignIcon,
    Spinner,
} from 'evergreen-ui';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SuccessPage from './SuccessPage';
import ExistingDigest from './ExistingDigest';
import ErrorMessage from '../ErrorMessage';

const senderNameDesc = `This will be the name of the sender displayed in the email. 
It is recommended that you do not change this. However, you could change this to e.g.
the name of the club advertising the event. Note that your real NetID will be included 
at the bottom of the email regardless of your display name.`;

export default function DigestForm({
    user,
    onSend,
    errorMessage,
    success,
    digest,
}) {
    const [desc, setDesc] = useState('')
    const [descInvalid, setDescInvalid] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [name, setName] = useState('')
    const [nameInvalid, setNameInvalid] = useState(false)
    const [sender, setSender] = useState(user.name)
    const [senderInvalid, setSenderInvalid] = useState(false)
    const [filled, setFilled] = useState(false);
    const [filledDesc, setFilledDesc] = useState(false);

    useEffect(() => {
        if (name === '') setFilled(true);
        if (filled) setNameInvalid(name === '');
        if (desc === '') setFilledDesc(true);
        if (filledDesc) setDescInvalid(desc === '');
        setSenderInvalid(sender === '');
    }, [name, sender, desc]);

    if (digest.Status === 'used') {
        return <ExistingDigest digest={digest} />;
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
            <TextInputField
                label="Name of Item Lost"
                isInvalid={nameInvalid}
                required
                placeholder="Item"
                validationMessage={nameInvalid ? 'Must have an item name' : null}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextInputField
                label="Displayed Sender Name"
                required
                isInvalid={senderInvalid}
                description={senderNameDesc}
                placeholder={user.name}
                validationMessage={senderInvalid ? 'Must have sender name' : null}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
            />
            <TextInputField
                label="Description of Item"
                isInvalid={descInvalid}
                required
                placeholder="Description"
                validationMessage={descInvalid ? 'Must have a description' : null}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />

            {/* Add functionality for onSend here */}

            <Pane>
                <Button
                    onClick={() => setShowConfirm(true)}
                    size="large"
                    appearance="primary"
                    float="right"
                >
                    Submit
                </Button>
                <Button
                    size="large"
                    appearance="default"
                    float="right"
                    marginRight="8px"
                >
                    Cancel
                </Button>
                <Link href="/">
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
