import { useEffect, useRef, useState } from 'react';

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
    Popover,
    IconButton,
} from 'evergreen-ui';
import Link from 'next/link';

import ErrorMessage from '@/components/ErrorMessage';
import ScheduleSelectField from '@/components/MailForm/ScheduledSend/ScheduleSelectField';
import SuccessPage from '@/components/MailForm/SuccessPage';

import QuillJSEditor from '../QuillJSEditor';

const senderNameDesc = `This is the name of the sender displayed in the email.
You can either keep it as your name or use the name of your club, department, or 
organization if you have permission to do so. Your full name will be included in the
footer of the email regardless of your sender name.`;

export default function Mail({ onSend, errorMessage, success, user }) {
    const [header, setHeader] = useLocalStorage('mailHeader', '');
    const [headerInvalid, setHeaderInvalid] = useState(false);
    const [sender, setSender] = useLocalStorage('mailSender', user.name);
    const [senderInvalid, setSenderInvalid] = useState(false);
    const hasInteracted = useRef(false);
    const [body, setBody] = useLocalStorage('mailBody', '');
    const [schedule, setSchedule] = useLocalStorage('mailSchedule', 'now');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showTestConfirm, setShowTestConfirm] = useState(false);
    const [isSending, setIsSending] = useState(false);

    function useLocalStorage(key, initialValue) {
        const [storedValue, setStoredValue] = useState(() => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch {
                return initialValue;
            }
        });

        useEffect(() => {
            localStorage.setItem(key, JSON.stringify(storedValue));
        }, [key, storedValue]);

        return [storedValue, setStoredValue];
    }

    useEffect(() => {
        if (!hasInteracted.current && header !== '') {
            hasInteracted.current = true;
        }

        if (hasInteracted.current) {
            setHeaderInvalid(header === '');
        }
        setSenderInvalid(sender === '');
    }, [header, sender]);

    const MailForm = (
        <Pane display='flex' flexDirection='column' gap={majorScale(4)}>
            <Pane display='flex' justifyContent='space-between'>
                <Heading size={800} marginY={majorScale(2)}>
                    Send an Email
                </Heading>
                <Link href='/scheduled'>
                    <Button
                        size='large'
                        appearance='default'
                        marginY={majorScale(2)}
                    >
                        Scheduled Emails
                    </Button>
                </Link>
            </Pane>
            <ErrorMessage text={errorMessage} />

            <ScheduleSelectField
                id='schedule-select-field'
                label={
                    <Pane
                        display='inline-flex'
                        alignItems='center'
                        gap={4}
                        height={20}
                    >
                        Scheduled Time
                        <Popover
                            content={
                                <Pane padding={16} maxWidth={320}>
                                    <Text>
                                        Emails go out in batches at 8am, 1pm,
                                        and 6pm EST. You can schedule up to four
                                        days ahead, and only one email per time
                                        slot.
                                    </Text>
                                </Pane>
                            }
                        >
                            <IconButton
                                icon={InfoSignIcon}
                                appearance='minimal'
                                height={20}
                                width={20}
                                aria-label='More about scheduling'
                            />
                        </Popover>
                    </Pane>
                }
                description='Send now, or schedule up to four days ahead.'
                inputWidth='100%'
                required
                includeNow
                schedule={schedule}
                handleScheduleChange={(e) => setSchedule(e.target.value)}
            />

            <Pane
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(260px, 1fr))'
                gap={majorScale(4)}
                alignItems='start'
            >
                <TextInputField
                    id='email-header-input'
                    label='Email Header'
                    isInvalid={headerInvalid}
                    required
                    placeholder='Hi from Hoagie!'
                    validationMessage={
                        headerInvalid ? 'Must have subject line' : null
                    }
                    value={header}
                    description='Title of your email'
                    onChange={(e) => setHeader(e.target.value)}
                />

                <TextInputField
                    id='email-header-input'
                    label={
                        <Pane display='inline-flex' alignItems='center'>
                            Displayed Sender Name
                            <Popover
                                content={
                                    <Pane padding={16} maxWidth={320}>
                                        <Text>
                                            Use your own name, or the name of
                                            your club, department or
                                            organization if you have permission
                                            to do so.
                                        </Text>
                                    </Pane>
                                }
                            >
                                <IconButton
                                    icon={InfoSignIcon}
                                    appearance='minimal'
                                    height={12}
                                    width={20}
                                    aria-label='More about the sender name'
                                />
                            </Popover>
                        </Pane>
                    }
                    description='Shown as the sender. Your full name still appears in the footer.'
                />
            </Pane>

            <QuillJSEditor
                label='Body Content'
                description='This is the content of your email.'
                onHTMLChange={(content) => {
                    setBody(content);
                }}
            />

            <Pane>
                <Button
                    onClick={() => setShowConfirm(true)}
                    size='large'
                    appearance='primary'
                    float='right'
                >
                    Send Email
                </Button>
                <Button
                    onClick={() => setShowTestConfirm(true)}
                    size='large'
                    appearance='secondary'
                    float='right'
                    marginRight='8px'
                >
                    Send Test Email
                </Button>
                <Link href='/app'>
                    <Button size='large' float='left'>
                        Back
                    </Button>
                </Link>
            </Pane>
            <Dialog
                isShown={showConfirm}
                hasHeader={false}
                hasClose={false}
                isConfirmLoading={isSending}
                onConfirm={async () => {
                    setIsSending(true);
                    await onSend({
                        sender,
                        header,
                        body,
                        schedule,
                    });
                    setIsSending(false);
                    setShowConfirm(false);
                }}
                onCloseComplete={() => setShowConfirm(false)}
                confirmLabel='Send Email'
                intent='warning'
            >
                <Pane
                    marginTop={35}
                    marginBottom={20}
                    display='flex'
                    alignItems='center'
                >
                    <InfoSignIcon marginRight={10} />
                    You are about to send an email to everyone at Princeton.
                </Pane>
                <Text>
                    Once you click <b>Send Email</b>, Hoagie will send the email
                    to
                    <b> all residential college listservs on your behalf</b>.
                    Your name and NetID will be included at the bottom of the
                    email regardless of the content.
                </Text>
                <Alert
                    intent='warning'
                    title='Use responsibly. Do not use this tool for personal messages.'
                    marginTop={20}
                >
                    Hoagie Mail sends out emails instantly, but if the tool is
                    used to send offensive, intentionally misleading or harmful
                    emails, the user will be banned from the platform and, if
                    necessary, reported to the University. Note that instant
                    email sending is reserved for clubs, departments, and
                    organizations.
                </Alert>
            </Dialog>
            <Dialog
                isShown={showTestConfirm}
                hasHeader={false}
                hasClose={false}
                isConfirmLoading={isSending}
                onConfirm={async () => {
                    setIsSending(true);
                    await onSend({
                        sender,
                        header,
                        body,
                        schedule: 'test',
                    });
                    setIsSending(false);
                    setShowTestConfirm(false);
                }}
                onCloseComplete={() => setShowTestConfirm(false)}
                confirmLabel='Send Test Email'
                intent='warning'
            >
                <Pane
                    marginTop={35}
                    marginBottom={20}
                    display='flex'
                    alignItems='center'
                >
                    <InfoSignIcon marginRight={10} />
                    You are about to send a test email to yourself
                </Pane>
                <Text>
                    You can send a test email to yourself to ensure that the
                    text, images, and other formatting appear as you intend.
                    Once you click <b>Send Test Email</b>, Hoagie will send the
                    email to
                    <b> your Princeton email</b>.
                </Text>
            </Dialog>
        </Pane>
    );
    return success ? <SuccessPage schedule={schedule} /> : MailForm;
}
