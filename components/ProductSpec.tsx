'use client';

import { ReactNode } from 'react';

import {
    Pane,
    Heading,
    Text,
    majorScale,
    useTheme,
} from 'evergreen-ui';
import Image from 'next/image';

import Divider from './Divider';

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


function Section({ title, body, children }: { title: string; body: string; children: ReactNode }) {
    return (
        <Pane width='100%'>
            <Pane
                maxWidth={1120}
                marginX='auto'
                display='flex'
                flexDirection='column'
                paddingY={majorScale(12)}
            >
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
        </Pane>
    );
}


export default function ProductSpec() {
    const theme = useTheme();

    return (
        <Pane width='100%'  display="flex" flexDirection="column" gap={majorScale(6)}>

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
                    <Image
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
                    ></Image>
                </Pane>
            </Section>

            <Divider />

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
                    <Image
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
                    ></Image>

                </Pane>
            </Section>

            <Divider />

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

                            <Image
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
                            ></Image>
                        </Pane>
                    ))}
                </Pane>
            </Section>

            <Divider />
        </Pane>
    );
}
