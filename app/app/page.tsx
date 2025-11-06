'use client';

import { useState, useEffect } from 'react';

import { useUser } from '@auth0/nextjs-auth0';
import {
    RadioGroup,
    Text,
    Heading,
    Pane,
    majorScale,
    Spinner,
    Button,
    Alert,
} from 'evergreen-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import View from '@/components/View';

export default function App() {
    const router = useRouter();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        if (queryParams.has('code')) {
            queryParams.delete('code');
            queryParams.delete('state');
            // TODO: add support for other params to persist using
            // queryParam.toString() or remove the queryParams method
            router.replace('/app');
        }
    }, [router]);
    const studentOrgLabel = (
        <Pane>
            <Text size={500}>
                <b>University Clubs, Departments, and Organizations</b>
                <br />
            </Text>
            <Text size={400}>
                Announcements on behalf of student clubs, departments, and
                Princeton-affiliated organizations.
            </Text>
        </Pane>
    );
    const lostFoundLabel = (
        <Pane>
            <Text size={500}>
                <b>Lost and Found Items</b>
                <br />
            </Text>
            <Text size={400}>
                Announcements about found, lost, or stolen things.
            </Text>
        </Pane>
    );
    const sellabel = (
        <Pane>
            <Text size={500}>
                <b>Student Sales</b>
                <br />
            </Text>
            <Text size={400}>
                Announcements about student sales of one or multiple items.
            </Text>
        </Pane>
    );
    const bulletinLabel = (
        <Pane>
            <Text size={500}>
                <b>Everything Else</b>
                <br />
            </Text>
            <Text size={400}>
                Emails that do not fit into any of these categories.
            </Text>
        </Pane>
    );

    const options = [
        { label: studentOrgLabel, value: 'studentorg' },
        { label: sellabel, value: 'sale' },
        { label: lostFoundLabel, value: 'lost' },
        { label: bulletinLabel, value: 'bulletin' },
    ];
    const [optionValue, setOptionValue] = useState('studentorg');

    const { user, isLoading } = useUser();
    if (isLoading) {
        return <Spinner />;
    }

    const bottomButtons = (
        <Pane>
            <Link
                href={
                    optionValue === 'studentorg'
                        ? '/send'
                        : `/digest?type=${optionValue}`
                }
            >
                <Button size='large' appearance='primary' float='right'>
                    Next
                </Button>
            </Link>
            <Link href='/'>
                <Button size='large' float='left'>
                    Back
                </Button>
            </Link>
        </Pane>
    );
    const SelectForm = (
        <Pane marginBottom={majorScale(4)}>
            {user && (
                <Heading
                    size={900}
                    marginTop={majorScale(2)}
                    marginBottom={majorScale(1)}
                >
                    Hi, {user.name}
                </Heading>
            )}

            <Text size={500}> Would you like to send an email about...</Text>

            <RadioGroup
                name="email-category"
                size={16}
                value={optionValue}
                options={options}
                isRequired
                marginTop={majorScale(3)}
                onChange={(event) => setOptionValue(event.target.value)}
            />
        </Pane>
    );

    return (
        <View>
            {SelectForm}
            <Pane marginBottom={30}>
                <Alert
                    intent='warning'
                    title='Choose the right email category.'
                    marginTop={20}
                >
                    Hoagie Mail updated its system to prioritize University
                    club, department, and organization announcements and added a
                    new digest service for other types of emails. Users who
                    abuse the system by selecting incorrect email categories
                    will be restricted from the platform indefinitely.
                </Alert>
            </Pane>
            {bottomButtons}
        </View>
    );
}
