import { useState } from 'react';

import DOMPurify from 'dompurify';
import {
    Button, Pane, Text, Paragraph, Dialog, InfoSignIcon,
} from 'evergreen-ui';

import formatDateString from '@/components/MailForm/ScheduledSend/formatDateString'
import ScheduleSelectField from '@/components/MailForm/ScheduledSend/ScheduleSelectField';

function ScheduledMailListing({
    listing, onDelete, onUpdate,
}) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [bodyShown, setBodyShown] = useState(false)
    const mailBody = DOMPurify.sanitize(listing.body)

    return (
        <Pane
            marginTop={20}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="default"
        >
            <Pane margin={20} marginBottom={-2} width="100%">
                <Button
                    float="right"
                    onClick={() => setBodyShown(!bodyShown)}
                >
                    {bodyShown ? 'Hide Email Body' : 'View Email Body'}
                </Button>
                <Text><b>Header:</b> { listing.header }</Text>
                <br />
                <Text><b>Sender:</b> { listing.sender }</Text>
                <br />
                {bodyShown && (
                    <Pane height="auto" overflow="auto">
                        <Text><b>Body:</b></Text>
                        <Pane margin={20} width="100%">
                            <Paragraph
                                size={300}
                                dangerouslySetInnerHTML={{ __html: mailBody }}
                            />
                        </Pane>
                    </Pane>
                )}
                <Text>
                    <b>Created time:</b> {` ${formatDateString(listing.createdAt, true)}`}
                </Text>
                <br />
                <Text>
                    <b>Scheduled time: </b>
                </Text>
                <br />
                <ScheduleSelectField
                    handleScheduleChange={(e) => {
                        onUpdate({
                            schedule: listing.schedule,
                            newSchedule: e.target.value,
                        })
                    }}
                    schedule={listing.schedule}
                    float="left"
                    marginTop="5px"
                    display="flex"
                />
                <Button
                    onClick={() => setShowConfirm(true)}
                    size="large"
                    appearance="primary"
                    float="right"
                >
                    Delete
                </Button>
                <Dialog
                    isShown={showConfirm}
                    hasHeader={false}
                    hasClose={false}
                    onConfirm={async () => {
                        await onDelete({
                            schedule: listing.schedule,
                            newSchedule: null,
                        })
                        setShowConfirm(false)
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
                        Are you sure you want to delete your email scheduled for
                        {` ${formatDateString(listing.schedule)}`}?
                    </Pane>
                    <Text>
                        This action <b>cannot be undone</b>.
                    </Text>
                </Dialog>
            </Pane>
        </Pane>
    )
}

export default function ScheduledMailPane({
    scheduledMail, onDelete, onUpdate,
}) {
    return (
        <Pane>{
            scheduledMail.map((listing) => (
                <ScheduledMailListing
                    listing={listing}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))
        }
        </Pane>
    )
}
