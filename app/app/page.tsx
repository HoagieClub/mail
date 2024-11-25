'use client';

import { useState, useEffect } from 'react';
import {
    RadioGroup, Text, Heading, Pane, majorScale, Spinner, Button, Alert,
} from 'evergreen-ui'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import View from '@/components/View';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export default withPageAuthRequired(() => {
    const { user, isLoading } = useUser();
    const router = useRouter()
    if (isLoading) { return <Spinner /> }

    useEffect(() => {
        // eslint-disable-next-line no-restricted-globals
        const queryParams = new URLSearchParams(location.search)

        if (queryParams.has('code')) {
            queryParams.delete('code')
            queryParams.delete('state')
            // TODO: add support for other params to persist using
            // queryParam.toString() or remove the queryParams method
            router.replace('/app')
        }
    }, [])
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
            <Text size={400}>
                Announcements about student sales of one or multiple items.
            </Text>
        </Pane>
    )
    // const sellOneLabel = (
    //     <Pane>
    //         <Text size={500}> <b>Selling or Buying</b><br /></Text>
    //         <Text size={400}>
    //             Announcements about selling one kind of item.
    //         </Text>
    //     </Pane>
    // )
    const bulletinLabel = (
        <Pane>
            <Text size={500}> <b>Everything Else</b><br /></Text>
            <Text size={400}> Emails that do not fit into any of these categories. </Text>
        </Pane>
    )

    const [options] = useState([
        { label: studentOrgLabel, value: 'studentorg' },
        { label: sellabel, value: 'sale' },
        // { label: sellOneLabel, value: 'selling' },
        { label: lostFoundLabel, value: 'lost' },
        { label: bulletinLabel, value: 'bulletin' },
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
        <View>
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
        </View>
    );
});
