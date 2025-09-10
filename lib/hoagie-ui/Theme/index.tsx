'use client';

import React from 'react';

import { ThemeProvider } from 'evergreen-ui';

import {
    hoagiePurple,
    hoagieOrange,
    hoagieUI,
} from '@/lib/hoagie-ui/Theme/themes';

interface ThemeProps {
    /** alternate color theme, default is purple
     * (current options: "purple", "blue", "orange") */
    palette?: string;
    /** React children (child components)
     * @ignore */
    children?: React.ReactNode;
}

/** Theme is an theme provider component meant for use as an app wrapper
 *  for all Hoagie applications.
 */
function Theme({ palette = 'purple', children }: ThemeProps) {
    let colorTheme;

    switch (palette) {
        case 'purple':
            colorTheme = hoagiePurple;
            break;
        case 'blue':
            colorTheme = hoagieUI;
            break;
        case 'orange':
            colorTheme = hoagieOrange;
            break;
        default:
            colorTheme = hoagieUI;
    }

    // document.body.style.backgroundColor = colorTheme.colors.blue100;
    return <ThemeProvider value={colorTheme}>{children}</ThemeProvider>;
}

export default Theme;
