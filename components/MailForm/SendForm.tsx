import { useEffect, useState } from 'react'

import {
    Pane,
    Heading,
    majorScale,
    Button,
    Alert,
    TextInputField,
    Dialog,
    Text,
    InfoSignIcon,
} from 'evergreen-ui'
import Link from 'next/link';

import ErrorMessage from '@/components/ErrorMessage';
import ScheduleSelectField from '@/components/MailForm/ScheduledSend/ScheduleSelectField';
import SuccessPage from '@/components/MailForm/SuccessPage'
import RichTextEditor from '@/components/RichSunEditor'

const senderNameDesc = `This is the name of the sender displayed in the email.
You can either keep it as your name or use the name of your club, department, or 
organization if you have permission to do so. Your full name will be included in the
footer of the email regardless of your sender name.`;

export default function Mail({
    onSend, onError, errorMessage, success, user,
}) {
    const [header, setHeader] = useState('')
    const [headerInvalid, setHeaderInvalid] = useState(false)
    const [editorCore, seteditorCore] = useState({ preview: null })
    const [sender, setSender] = useState(user.name)
    const [senderInvalid, setSenderInvalid] = useState(false)
    const [filled, setFilled] = useState(false);
    const [body, setBody] = useState('')
    const [schedule, setSchedule] = useState('now')
    const [showConfirm, setShowConfirm] = useState(false)

    const getEditor = (sunEditor) => {
        seteditorCore(sunEditor.core)
    };

    useEffect(() => {
        if (header === '') setFilled(true);
        if (filled) setHeaderInvalid(header === '');
        setSenderInvalid(sender === '');
    }, [header, sender, filled]);

    const MailForm = (
        <Pane>
            <Pane display="flex" justifyContent="space-between">
                <Heading
                    size={800}
                    marginY={majorScale(2)}
                >
                    Send an Email
                </Heading>
                <Link href="/scheduled">
                    <Button
                        size="large"
                        appearance="default"
                        marginY={majorScale(2)}
                    >
                        Scheduled Emails
                    </Button>
                </Link>
            </Pane>
            <ErrorMessage text={errorMessage} />
            <ScheduleSelectField
                label="NEW FEATURE: Scheduled Time"
                description="Send emails now or schedule them up to four days
                in advance! Emails will be sent out in batches at 8am,
                1pm, and 6pm EST. You may only schedule one email per time slot."
                required
                includeNow
                schedule={schedule}
                handleScheduleChange={(e) => setSchedule(e.target.value)}
            />
            <TextInputField
                label="Email Header"
                isInvalid={headerInvalid}
                required
                description="This is the title of the email to the listservs."
                placeholder="Hi from Hoagie!"
                validationMessage={headerInvalid ? 'Must have subject line' : null}
                value={header}
                onChange={(e) => setHeader(e.target.value)}
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
            <RichTextEditor
                onChange={(content) => setBody(content)}
                onError={onError}
                label="Body Content"
                required
                getEditor={getEditor}
                placeholder="Hello there!"
                description={`
        This is the content of your email. `}
            />
            <Pane>
                <Button
                    onClick={() => setShowConfirm(true)}
                    size="large"
                    appearance="primary"
                    float="right"
                >
                    Send Email
                </Button>
                <Button
                    disabled={!editorCore.preview}
                    onClick={() => { editorCore.preview() }}
                    size="large"
                    appearance="default"
                    float="right"
                    marginRight="8px"
                >
                    See Preview
                </Button>
                <Link href="/app">
                    <Button size="large" float="left">Back</Button>
                </Link>
            </Pane>
            <Dialog
                isShown={showConfirm}
                hasHeader={false}
                hasClose={false}
                onConfirm={async () => {
                    await onSend({
                        sender, header, body, schedule,
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
                    display="flex"
                    alignItems="center"
                >
                    <InfoSignIcon marginRight={10} />
                    You are about to send an email to all undergraduates at Princeton.
                </Pane>
                <Text>
                    Once you click <b>Send Email</b>, Hoagie will send the email to
                    <b> all residential college listservs on your behalf</b>.
                    Your name and NetID will be included at the bottom of the email
                    regardless of the content.
                </Text>
                <Alert
                    intent="warning"
                    title="Use responsibly. Do not use this tool for personal messages."
                    marginTop={20}
                >
                    Hoagie Mail sends out emails instantly,
                    but if the tool is used to send offensive,
                    intentionally misleading or harmful emails,
                    the user will be banned from the platform
                    and, if necessary, reported to the University.
                    Note that instant email sending is reserved for
                    clubs, departments, and organizations.
                </Alert>
            </Dialog>
        </Pane>
    );
    return success ? <SuccessPage schedule={schedule} /> : MailForm;
}
