import {
    Pane, majorScale, Spinner,
} from 'evergreen-ui'
import { useUser } from '@auth0/nextjs-auth0';
import DigestForm from './DigestForm';
import SendForm from './SendForm';

export default function MailForm({
    onSend, onError, errorMessage, success, isDigest,
    digest = { status: 'unused' }, loading = false,
}) {
    const { user, isLoading } = useUser();
    if (isLoading || loading) { return <Spinner /> }

    return (
        <Pane
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginX={majorScale(1)}
            paddingBottom={majorScale(4)}
            paddingTop={majorScale(8)}
        >
            <Pane
                borderRadius={8}
                textAlign="left"
                elevation={1}
                background="white"
                marginX={20}
                maxWidth="600px"
                width="100%"
                paddingX={majorScale(4)}
                paddingTop={majorScale(2)}
                paddingBottom={majorScale(4)}
            >
                { isDigest
                    ? (
                        <DigestForm
                            onSend={onSend}
                            errorMessage={errorMessage}
                            success={success}
                            digest={digest}
                        />
                    )
                    : (
                        <SendForm
                            user={user}
                            onSend={onSend}
                            onError={onError}
                            errorMessage={errorMessage}
                            success={success}
                        />
                    )}
            </Pane>
        </Pane>
    );
}
