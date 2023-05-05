import {
    Spinner, Button, Pane, Heading, Link, Text, Paragraph,
    Alert, majorScale, Dialog, InfoSignIcon,
} from 'evergreen-ui';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import formatDateString from './formatDateString'

function ScheduledMailListing({
    listing,
}) {
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
            <Pane margin={20} width="100%">
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
                <Text><b>Created time:</b> { formatDateString(listing.createdAt) }</Text>
                <br />
                <Text><b>Scheduled time:</b> { formatDateString(listing.schedule) }</Text>
                <br />
                <br />
                <Button size="large" appearance="primary" float="left">
                    Set New Scheduled Time
                </Button>
                <Button size="large" appearance="primary" float="right">
                    Delete
                </Button>
                <br />
            </Pane>
        </Pane>
    )
}

export default function ScheduledMailPane({
    scheduledMail,
}) {
    return (
        <Pane>{
            scheduledMail.map((listing) => (
                <ScheduledMailListing listing={listing} />
            ))
        }
        </Pane>
    )
}
