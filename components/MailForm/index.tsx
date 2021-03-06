import {
    Spinner,
} from 'evergreen-ui'
import { useUser } from '@auth0/nextjs-auth0';
import DigestForm from './DigestForm';
import SendForm from './SendForm';
import View from '../View';

export default function MailForm({
    onSend, onError, errorMessage, success, isDigest,
    digest = { status: 'unused' }, onDelete = (() => {}),
    loading = false,
}) {
    const { user, isLoading } = useUser();
    if (isLoading || loading) { return <Spinner /> }

    return (
        <View>
            { isDigest
                ? (
                    <DigestForm
                        onSend={onSend}
                        errorMessage={errorMessage}
                        success={success}
                        digest={digest}
                        onDelete={onDelete}
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
        </View>
    );
}
