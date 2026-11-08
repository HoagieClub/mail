import { Pane, majorScale, useTheme } from 'evergreen-ui';

export const PAGE_MARGIN = majorScale(5);

export default function Divider() {
    const theme = useTheme();
    return (
        <Pane
            alignSelf='stretch'
            marginX={-PAGE_MARGIN}
            height={1}
            background={theme.colors.gray300}
        />
    );
}
