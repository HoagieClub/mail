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
} from 'evergreen-ui';
import Link from 'next/link';

import ErrorMessage from '@/components/ErrorMessage';
import ScheduleSelectField from '@/components/MailForm/ScheduledSend/ScheduleSelectField';
import SuccessPage from '@/components/MailForm/SuccessPage';
import { TemplateSelector } from '@/components/MailForm/TemplateSelector';
import { EMAIL_TEMPLATES } from '@/constants/emailTemplates';
import { TemplateType } from '@/types/template';

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
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('blank');
    const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState<TemplateType | null>(null);
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

    const handleTemplateSelect = (type: TemplateType) => {
        const template = EMAIL_TEMPLATES.find((t) => t.type === type);
        if (!template) return;

        // Normalize HTML content by stripping tags and non-breaking spaces,
        // then trimming. This treats "<p><br></p>", "<p></p>", and similar
        // editor-empty HTML as empty so selecting a template won't show the
        // replace warning when the editor is effectively blank.
        const normalize = (s: string | undefined | null) =>
            (s || '')
                .replace(/&nbsp;/g, ' ')
                .replace(/<[^>]*>/g, '')
                .trim();

        const hasEditorContent = normalize(body) !== '';
        const wouldChangeBody = normalize(template.bodyTemplate) !== normalize(body);

        if (hasEditorContent && wouldChangeBody) {
            setPendingTemplate(type);
            setShowReplaceConfirm(true);
            return;
        }

        // Safe to apply immediately (only change body now)
        setSelectedTemplate(type);
        setBody(template.bodyTemplate);
    };

    const MailForm = (
        <Pane>
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
                label='Scheduled Time'
                description='Send emails now or schedule them up to four days
                in advance! Emails will be sent out in batches at 8am,
                1pm, and 6pm EST. You may only schedule one email per time slot.'
                required
                includeNow
                schedule={schedule}
                handleScheduleChange={(e) => setSchedule(e.target.value)}
            />
            <TextInputField
                id='email-header-input'
                label='Email Header'
                isInvalid={headerInvalid}
                required
                description='This is the title of the email to the listservs.'
                placeholder='Hi from Hoagie!'
                validationMessage={
                    headerInvalid ? 'Must have subject line' : null
                }
                value={header}
                onChange={(e) => setHeader(e.target.value)}
            />
            <TextInputField
                id='sender-name-input'
                label='Displayed Sender Name'
                required
                isInvalid={senderInvalid}
                description={senderNameDesc}
                placeholder={user.name}
                validationMessage={
                    senderInvalid ? 'Must have sender name' : null
                }
                value={sender}
                onChange={(e) => setSender(e.target.value)}
            />
            <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={handleTemplateSelect}
                />
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
            <Dialog
                isShown={showReplaceConfirm}
                hasHeader={false}
                hasClose={false}
                onConfirm={() => {
                    if (!pendingTemplate) return;
                    const template = EMAIL_TEMPLATES.find(
                        (t) => t.type === pendingTemplate
                    );
                    if (template) {
                        setSelectedTemplate(pendingTemplate);
                        setBody(template.bodyTemplate);
                    }
                    setPendingTemplate(null);
                    setShowReplaceConfirm(false);
                }}
                onCloseComplete={() => {
                    setPendingTemplate(null);
                    setShowReplaceConfirm(false);
                }}
                confirmLabel='Replace Text'
                intent='warning'
            >
                <Pane
                    marginTop={35}
                    marginBottom={20}
                    display='flex'
                    alignItems='center'
                >
                    <InfoSignIcon marginRight={10} />
                    Are you sure you want to replace the existing text in the
                    editor with this template?
                </Pane>
            </Dialog>
        </Pane>
    );
    return success ? <SuccessPage schedule={schedule} /> : MailForm;
}
