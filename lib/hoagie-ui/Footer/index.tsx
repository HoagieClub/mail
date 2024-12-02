'use client';

import { Pane, majorScale, useTheme } from 'evergreen-ui';

/** Footer is a generic page footer meant for use throughout
 * different Hoagie applications.
 */
function Footer() {
    const theme = useTheme();
    const logo = (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='69'
            height='22'
            fill='none'
        >
            <path
                d='M57.647 20.724c5.232 0 9.474-4.242 9.474-9.474s-4.241-9.474-9.474-9.474H39.66L25.375 20.724h32.272z'
                fill={theme.colors.blue500}
            />
            <path
                d='M25.375 20.724h32.272c5.232 0 9.474-4.242 9.474-9.474h0c0-5.232-4.241-9.474-9.474-9.474H39.66M25.375 20.724H10.752c-5.232 0-9.474-4.242-9.474-9.474h0c0-5.232 4.242-9.474 9.474-9.474h8.024m6.6 18.948L39.66 1.777m0 0H28.112m0 0l-7.53 9.581m7.53-9.581h-9.337m0 0l-6.534 8.645'
                stroke='#212121'
                strokeWidth='2.482'
                strokeLinecap='round'
            />
        </svg>
    );
    return (
        <Pane
            display='flex'
            justifyContent='center'
            height='100px'
            paddingBottom='30px'
            alignItems='center'
            fontSize='14pt'
            marginX={majorScale(1)}
        >
            <a href='https://club.hoagie.io' target='_blank' rel='noreferrer'>
                <Pane
                    maxWidth='600px'
                    fontSize={14}
                    display='flex'
                    alignItems='center'
                >
                    <Pane marginRight={8}>{logo}</Pane>
                    <Pane paddingBottom={3}>
                        Made by <b>Hoagie Club.</b>
                    </Pane>
                </Pane>
            </a>
        </Pane>
    );
}

export default Footer;
