import { Pane, majorScale, Spinner, Button, Alert, TextInputField, Dialog, Paragraph, InfoSignIcon, TickCircleIcon } from 'evergreen-ui'


export default function Footer() {
    return (
        <Pane elevation={1}>
        <Pane display="flex" justifyContent="center" width="100%" height={majorScale(9)} background="orange200">
            <Pane 
                display="flex" 
                alignItems="center" 
                width="100%" 
                height="100%" 
                maxWidth={1200} 
                paddingX={20}
            >
               <Paragraph>Hoagie Apps are built and maintained by Princeton University students, for Princeton students.</Paragraph>
            </Pane>
        </Pane>
    </Pane>
    )
}

