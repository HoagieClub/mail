import { Spinner } from 'evergreen-ui'
import DigestForm from './DigestForm';
import SendForm from './SendForm';
import View from '../View';
import { useMockableUser } from '../../mock/User';

export default function MailForm({
    onSend, onTestSend, onError, errorMessage, success, isDigest,
    digest = { status: 'unused' }, onDelete = (() => {}),
    loading = false,
}) {
    const { user, isLoading } = useMockableUser();
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
                        onTestSend={onTestSend}
                        onError={onError}
                        errorMessage={errorMessage}
                        success={success}
                    />
                )}
        </View>
    );
}
