'use client';

import { useEffect, useRef } from 'react';

import { useUser } from '@auth0/nextjs-auth0';
import {
    Pane,
    majorScale,
    Heading,
    Spinner,
    EnvelopeIcon,
    Button,
    useTheme,
} from 'evergreen-ui';
import Link from 'next/link';

import Divider, { PAGE_MARGIN } from '@/components/Divider';
import ProductSpec from '@/components/ProductSpec';
import AuthButton from '@/lib/hoagie-ui/AuthButton';

export default function Index() {
    const theme = useTheme();
    const { user, isLoading } = useUser();

    let Actions;
    if (isLoading) {
        Actions = <Spinner />;
    } else if (user) {
        Actions = (
            <>
                <Button
                    is={Link}
                    href='/app'
                    height={56}
                    width={majorScale(28)}
                    appearance='primary'
                    iconBefore={EnvelopeIcon}
                >
                    Send a new Email
                </Button>
                <AuthButton variant='logout' />
            </>
        );
    } else {
        Actions = <AuthButton />;
    }

    return (
        <Pane
            display='flex'
            flexDirection='column'
            alignItems='center'
            gap={majorScale(6)}
            marginX={PAGE_MARGIN}
            marginBottom={majorScale(4)}
        >
            <Pane width='100%'>
                {/* Hero: tall area with the text near the bottom */}
                <Pane
                    display='flex'
                    flexDirection='column'
                    justifyContent='flex-end'
                    alignItems='center'
                    minHeight='max(480px, calc(100vh - 212px))'
                    width='100%'
                    paddingTop={majorScale(8)}
                >
                    <Pane maxWidth={1120} width='100%'>
                        <Heading
                            fontSize='clamp(40px, 4vw, 80px)'
                            lineHeight={1.05}
                            className='hoagie'
                        >
                            Send emails to everyone <br />
                            on campus, <b>instantly</b>.
                        </Heading>
                        <p>No more mail forwarding necessary.</p>
                        <Pane
                            display='flex'
                            flexDirection='row'
                            alignItems='center'
                            justifyContent='flex-start'
                            gap={majorScale(2)}
                            marginBottom={30}
                        >
                            {Actions}
                        </Pane>
                    </Pane>
                </Pane>

                {/* Product panel: centered, peeks in above the fold */}
                <Pane
                    maxWidth={1120}
                    width='100%'
                    marginX='auto'
                    background={theme.colors.gray200}
                    borderRadius={12}
                    padding={majorScale(8)}
                    marginBottom={majorScale(12)}
                >
                    <Pane elevation={1}>
                        <DemoVideo />
                    </Pane>
                </Pane>
            </Pane>

            <Divider />
            <ProductSpec />


            {/* Closing call to action */}
            <Pane
                display='flex'
                flexDirection='column'
                gap={majorScale(6)}
                justifyContent='center'
                alignItems='center'
                height='80vh'
            >
                <Heading
                    fontSize='clamp(40px, 4vw, 80px)'
                    lineHeight={1.25}
                    textAlign='center'
                    className='hoagie'
                >
                    Your announcement, <br />
                    in every inbox
                </Heading>

                <Pane display='flex' gap={majorScale(2)}>
                    {Actions}
                </Pane>
            </Pane>
        </Pane>
    );
}

function DemoVideo() {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;
        if (!video) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) video.play().catch(() => {});
                else video.pause();
            },
            { threshold: 0.2 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <video
            ref={ref}
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
            poster='/hoagie-mail-poster.webp'
            style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 12 }}
        >
            <source src='/hoagie-mail-demo.webm' type='video/webm' />
            <source src='/hoagie-mail-demo.mp4' type='video/mp4' />
        </video>
    );
}
