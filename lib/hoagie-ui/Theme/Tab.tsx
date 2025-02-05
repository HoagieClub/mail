import { defaultTheme } from 'evergreen-ui';

const defTheme: any = defaultTheme;

const Tab = {
    ...defTheme.components.Tab,
    appearances: {
        ...defTheme.components.Tab.appearances,
        navbar: {
            ...defTheme.components.Tab.appearances.primary,
            fontSize: '14px',
        },
    },
};

export default Tab;
