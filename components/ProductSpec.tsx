'use client';

import { ReactNode, useState } from 'react';

import { Pane, Heading, Text, majorScale, useTheme } from 'evergreen-ui';

const steps = [
    { title: 'Sign in', body: 'Log in to Hoagie Mail to get started.' },
    {
        title: 'Write your email',
        body: 'Add your message, plus any images or PDFs.',
    },
    {
        title: 'Send yourself a test',
        body: 'Check exactly how it looks before it goes out.',
    },
    {
        title: 'Send or schedule',
        body: 'Send to the university’s listservs now, or schedule it for later.',
    },
];

const examples = [
    {
        label: 'Clubs',
        subject: 'Spring club fair this Friday',
        body: 'Come by the lawn at noon to meet the clubs and sign up.',
    },
    {
        label: 'Events',
        subject: 'Guest lecture on campus tonight',
        body: 'Doors open at 6 PM. Everyone is welcome, and seats are first come.',
    },
    {
        label: 'Student sales',
        subject: 'Selling a desk and a mini fridge',
        body: 'Both are in good shape. Reply if you want to pick them up this week.',
    },
    {
        label: 'Lost and found',
        subject: 'Found: blue water bottle near the library',
        body: 'It’s with the front desk. Reply with a description to claim it.',
    },
];

function Badge({ children }: { children: ReactNode }) {
    const theme = useTheme();
    return (
        <Pane
            width={28}
            height={28}
            borderRadius={6}
            display='flex'
            alignItems='center'
            justifyContent='center'
            background={theme.colors.blue50}
            color={theme.colors.blue600}
            fontWeight={600}
            fontSize={13}
        >
            {children}
        </Pane>
    );
}

function Pill({ children }: { children: ReactNode }) {
    const theme = useTheme();
    return (
        <Pane
            display='inline-block'
            paddingX={10}
            paddingY={2}
            borderRadius={99}
            color={theme.colors.blue600}
            fontSize={12}
            fontWeight={600}
        >
            {children}
        </Pane>
    );
}

function Section({
    title,
    body,
    children,
}: {
    title: string;
    body: string;
    children: ReactNode;
}) {
    return (
        <Pane display='flex' flexDirection='column'>
            {/* Header row: title left, body right */}
            <Pane
                display='flex'
                flexWrap='wrap'
                justifyContent='space-between'
                alignItems='flex-start'
                gap={majorScale(4)}
                marginBottom={majorScale(6)}
            >
                <Pane flex='1 1 320px' maxWidth={400}>
                    <Heading size={900}>{title}</Heading>
                </Pane>
                <Pane flex='1 1 320px' maxWidth={440}>
                    <Text size={500} color='muted' display='block'>
                        {body}
                    </Text>
                </Pane>
            </Pane>

            {/* Visual: full width below the header */}
            <Pane width='100%'>{children}</Pane>
        </Pane>
    );
}

function EmailPreview({ subject, body }: { subject: string; body: string }) {
    const theme = useTheme();
    return (
        <Pane
            border='default'
            borderRadius={8}
            background={theme.colors.tint2}
            padding={majorScale(3)}
            minHeight={150}
        >
            <Text size={300} color='muted' display='block'>
                To: all university listservs
            </Text>
            <Text size={500} fontWeight={600} display='block' marginTop={6}>
                {subject}
            </Text>
            <Text color='muted' display='block' marginTop={6}>
                {body}
            </Text>
        </Pane>
    );
}

export default function ProductSpec() {
    const [active, setActive] = useState(0);
    const theme = useTheme();

    return (
        // Every section sits 152px below the thing above it. The first one also
        // gets the 32px gap from the landing page, so its top margin is 120px.
        <Pane
            maxWidth={1120}
            width='100%'
            display='flex'
            flexDirection='column'
            gap={majorScale(19)}
            marginTop={majorScale(15)}
        >
            {/* 2. Reach: text left, your graphic on the right */}
            <Section
                title='Reaches the whole university'
                body='Your email goes out to all the university’s listservs, so nobody has to forward it.'
            >
                <Pane
                    border='default'
                    borderRadius={8}
                    overflow='hidden'
                    background='white'
                >
                    <img
                        src='/listserv.webp'
                        alt='One email fanning out to the university listservs'
                        width={1120}
                        height={630}
                        loading='lazy'
                        decoding='async'
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                </Pane>
            </Section>

            {/* 3. Announcement types: preview left, text right, tabs swap the example */}
            <Section
                title='For every campus announcement'
                body='Share club news, university events, student sales, and lost and found.'
            >
                <Pane
                    border='default'
                    borderRadius={8}
                    overflow='hidden'
                    background='white'
                >
                    <img
                        src='/integration.webp'
                        alt='One email fanning out to the university listservs'
                        width={1120}
                        height={630}
                        loading='lazy'
                        decoding='async'
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                </Pane>
            </Section>

            {/* 4. Write it your way, plus what is coming soon */}
            <Section
                title='Write it your way'
                body='Format your message like any email, and add images and PDFs, like a flyer or a poster. More is on the way.'
            >
                <Pane
                    display='flex'
                    flexDirection='row'
                    gap={majorScale(2)}
                    width='100%'
                >
                    {[
                        {
                            title: 'Email templates',
                            body: 'Start from a template instead of a blank email.',
                            img: '/templates.webp',
                        },
                        {
                            title: 'HoagieCalendar integration',
                            body: 'Connect Hoagie Mail to HoagieCalendar.',
                            img: '/calendar.webp',
                        },
                    ].map((item) => (
                        <Pane
                            key={item.title}
                            background={theme.colors.gray100}
                            borderRadius={8}
                            width='100%'
                            padding={majorScale(3)}
                            display='flex'
                            flexDirection='column'
                            gap={majorScale(4)}
                        >
                            <Pane
                                display='flex'
                                flexDirection='column'
                                gap={majorScale(1)}
                            >
                                <Text size={300}>{item.body}</Text>
                                <Pane
                                    display='flex'
                                    justifyContent='space-between'
                                >
                                    <Heading display='inline' size={800}>
                                        {item.title}
                                    </Heading>
                                    <Pill>(Coming soon)</Pill>
                                </Pane>
                            </Pane>

                            <img
                                src={item.img}
                                alt='One email fanning out to the university listservs'
                                width={1120}
                                height={630}
                                loading='lazy'
                                decoding='async'
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                }}
                            />
                        </Pane>
                    ))}
                </Pane>
            </Section>
        </Pane>
    );
}
