import { Button, Pane } from 'evergreen-ui';

export default function SuccessPage() {
    
    return (
        <Pane
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingY={40}
        >
            <div className="success-animation">
                {/* eslint-disable-next-line max-len */}
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
            </div>
            <h1 className="h1">Success!</h1>
            <Pane>
                Your email has been sent to all undergraduate students
                and will be in your inbox shortly!
                We ask that you do not send any additional emails
                <b> for the next 24 hours</b> to avoid spam.
                <br /> <br />
                Thank you for using Hoagie Mail!
                If you would like to give feedback or are interested
                in our future projects, feel free to contact us through
                <b><a href="mailto:hoagie@princeton.edu"> hoagie@princeton.edu</a></b>.
            </Pane>
            <a href="https://hoagie.io/">
                <Button appearance="primary" marginTop="30px">
                    Back to hoagieplatform
                </Button>
            </a>
        </Pane>
    )
}
