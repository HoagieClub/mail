'use client';

import { useState } from 'react';

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
import { useTheme } from 'evergreen-ui';

import View from '@/components/View';

export default function App() {
    const theme = useTheme();
    
    const studentOrgLabel = (
        <Pane>
            <Text size={500}>
                <b>University Clubs, Departments, and Organizations</b>
                <br />
            </Text>
            <Text size={300}>
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
            <Text size={300}>
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
            <Text size={300}>
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
            <Text size={300}>
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


    const CategoryGrid = (
        <Pane
            role='radiogroup'
            aria-label='Email category'
            display='grid'
            gridTemplateColumns='repeat(2, 1fr)'
            gap={majorScale(2)}
            marginTop={majorScale(3)}
        >
            {options.map((option) => {
                const selected = optionValue === option.value;
                return (
                    <Pane
                        key={option.value}
                        role='radio'
                        aria-checked={selected}
                        tabIndex={0}
                        elevation={1}
                        hoverElevation={2}
                        background={selected ? theme.colors.blue25 : 'white'}
                        border={`2px solid ${selected ? theme.colors.blue500 : 'transparent'}`}
                        borderRadius={8}
                        padding={majorScale(3)}
                        cursor='pointer'
                        onClick={() => setOptionValue(option.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setOptionValue(option.value);
                            }
                        }}
                    >
                        {option.label}
                    </Pane>
                );
            })}
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

            {CategoryGrid}
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
