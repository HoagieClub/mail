import {
    Button, Pane, Heading, Text, Alert, majorScale,
} from 'evergreen-ui';
import Link from 'next/link';

export default function ExistingDigest({
    digest,
}) {
    const {
        Title,
        Category,
        Description,
        Email,
    } = digest;
    return (
        <Pane>
            <Heading
                size={800}
                marginY={majorScale(2)}
            >Your Current Digest Message:
            </Heading>
            <Text>
                This message will be sent to all listservs at
                <b> 12 pm January 20th, 2022</b>
            </Text>
            <Pane
                marginTop={20}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="default"
            >
                <Pane margin={20}>
                    <Text><b>Title:</b> { Title }</Text>
                    <br />
                    <Text><b>Category:</b> { Category }</Text>
                    <br />
                    <Text><b>Contact:</b>  { Email } </Text>
                    <br />
                    <br />
                    <Text><b>Description:</b> { Description } </Text>
                    <br />
                    {/* eslint-disable-next-line max-len */}
                    <Text>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available</Text>
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
                <Button size="large" appearance="primary" float="right">
                    Delete
                </Button>
                <Link href="/">
                    <Button size="large" float="left">Back</Button>
                </Link>
            </Pane>
        </Pane>
    )
}
