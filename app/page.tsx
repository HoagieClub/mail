'use client';

import { useUser } from '@auth0/nextjs-auth0';
import {useRef, useEffect} from 'react'
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

import AuthButton from '@/lib/hoagie-ui/AuthButton';
import ProductSpec from '@/components/ProductSpec';

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
            gap={32}
            marginX={majorScale(5)}
        >
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
                        alignItems='left'
                        justifyContent='left'
                        gap={majorScale(2)}
                        marginTop={30}
                    >
                        {Actions}
                    </Pane>
                </Pane>
            </Pane>

            {/* Product panel: sits below the hero and peeks in above the fold */}
            <Pane
                maxWidth={1120}
                width='100%'
                background={theme.colors.gray200}
                borderRadius={12}
                padding={majorScale(8)}
            >
                <Pane 
                    elevation={1}
                >
                    <DemoVideo />
                </Pane>
            </Pane>

            <ProductSpec />
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