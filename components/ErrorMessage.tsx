// ErrorMessage is a simple component to
// display an error message if one exists
import { Alert } from 'evergreen-ui';

export default function ErrorMessage({
    title = 'Error occured.',
    text,
}) {
    return (text
        && (
            <Alert
                intent="danger"
                title={title}
                marginY={20}
            >
                { text }
            </Alert>
        )
    )
}
