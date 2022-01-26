import { useState } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
    RadioGroup, Text, Heading, Pane, majorScale, Spinner, Button, Alert,
} from 'evergreen-ui'
import Link from 'next/link';

export default withPageAuthRequired(() => {
    const { user, isLoading } = useUser();
    if (isLoading) { return <Spinner /> }

    const studentOrgLabel = (
        <Pane>
            <Text size={500}>
                <b>University Clubs, Departments, and Organizations</b>
                <br />
            </Text>
            <Text size={400}> Announcements on behalf of
                student clubs, departments, and
                Princeton-affiliated organizations.
            </Text>
        </Pane>
    )
    const lostFoundLabel = (
        <Pane>
            <Text size={500}> <b>Lost and Found Items</b><br /></Text>
            <Text size={400}>
                Announcements about found, lost, or stolen things.
            </Text>
        </Pane>
    )
    const sellabel = (
        <Pane>
            <Text size={500}> <b>Student Sales</b><br /></Text>
            <Text size={400}> Announcements about student sales. </Text>
        </Pane>
    )
    const miscLabel = (
        <Pane>
            <Text size={500}> <b>Miscellaneous</b><br /></Text>
            <Text size={400}> Emails that do not fit into any of these categories. </Text>
        </Pane>
    )

    const [options] = useState([
        { label: studentOrgLabel, value: 'studentorg' },
        { label: sellabel, value: 'sale' },
        { label: lostFoundLabel, value: 'lost' },
        { label: miscLabel, value: 'misc' },
    ])
    const [optionValue, setOptionValue] = useState('studentorg')

    const bottomButtons = (
        <Pane>
            <Link href={optionValue === 'studentorg'
                ? '/send' : `/digest?type=${optionValue}`}
            >
                <Button size="large" appearance="primary" float="right">
                    Next
                </Button>
            </Link>
            <Link href="/">
                <Button size="large" float="left">Back</Button>
            </Link>

        </Pane>
    )
    const SelectForm = (
        <Pane marginBottom={majorScale(4)}>
            <Heading
                size={900}
                marginTop={majorScale(2)}
                marginBottom={majorScale(1)}
            >Hi, {user.name}
            </Heading>
            <Text
                size={500}
            > Would you like to send an email about...
            </Text>

            <RadioGroup
                size={16}
                value={optionValue}
                options={options}
                isRequired
                marginTop={majorScale(3)}
                onChange={(event) => setOptionValue(event.target.value)}
            />

        </Pane>
    )

    return (
        <Pane
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginX={majorScale(1)}
            paddingBottom={majorScale(4)}
            paddingTop={majorScale(8)}
        >
            <Pane
                borderRadius={8}
                textAlign="left"
                elevation={1}
                background="white"
                marginX={majorScale(3)}
                maxWidth="600px"
                width="100%"
                paddingX={majorScale(4)}
                paddingTop={majorScale(2)}
                paddingBottom={majorScale(4)}
            >
                { SelectForm }
                <Pane
                    marginBottom={30}
                >
                    <Alert
                        intent="warning"
                        title="Choose the right email category."
                        marginTop={20}
                    >
                        Hoagie Mail updated its system to prioritize
                        University club, department, and organization
                        announcements and added a new digest service for
                        other types of emails.
                        Users who abuse the system by selecting
                        incorrect email categories will be restricted
                        from the platform indefinitely.
                    </Alert>
                </Pane>
                {bottomButtons}
            </Pane>
        </Pane>
    );
})
