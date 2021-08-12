import { useEffect, useState } from 'react'
import RichTextEditor from "../components/RichTextEditor"
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import { Pane, majorScale, Spinner, Button, TextInputField } from 'evergreen-ui'
import AuthButton from '../src/everpurple/AuthButton'

export default function Mail() {
  const { user, error, isLoading } = useUser();
  let Profile;
  if (isLoading) Profile = <Spinner />;
  else if (error) Profile = <div>{error.message}</div>;
  else if (user) Profile = <Pane>
      <hr/>
      <h2>Welcome {user.name}!</h2>
      <p>This is just a demo but thank you for trying it out.</p>
      <AuthButton logout={true} />
    </Pane>;
  else Profile = <AuthButton />

  const [header, setHeader] = useState('')
  const [headerInvalid, setHeaderInvalid] = useState(false)
  const [sender, setSender] = useState('')
  const [senderInvalid, setSenderInvalid] = useState(false)
  const [body, setBody] = useState('')

  useEffect( () => {
    setHeaderInvalid(header == "");
    setSenderInvalid(sender == "");
  }, [header, sender]);

  return (
    <Pane display="flex" justifyContent="center" alignItems="center" 
    paddingBottom={majorScale(10)}
    paddingTop={majorScale(8)}
    >
      <Pane 
          borderRadius={20} 
          textAlign="left" 
          elevation={1} 
          background="white" 
          marginX={20} 
          maxWidth="600px" 
          width="100%"
          paddingX={majorScale(4)}
          paddingTop={majorScale(2)}
          paddingBottom={majorScale(4)}>
          <h2>New Email Send</h2>
        <TextInputField
          label="Email Header"
          labelFor="header"
          isInvalid={headerInvalid}
          required
          description={`Content: ${header}`}
          placeholder={"Hi from Hoagie!"}
          validationMessage = {headerInvalid ? "Must have subject line" : null}
          value={header}
          onChange={e => setHeader(e.target.value)}
        />
        <TextInputField
          label="Displayed Sender Name"
          labelFor="sender"
          required
          isInvalid={senderInvalid}
          description={`Content: ${sender}`}
          placeholder={isLoading ? "Tammy Tiger": user.name}
          validationMessage = {senderInvalid ? "Must have sender name" : null}
          value={sender}
          onChange={e => setSender(e.target.value)}
        />
        <RichTextEditor 
          label="Body Content"
          required
          isInvalid={true}
          description={`Content: ${body}`}
          placeholder={"The body text of your email."}
          onChange={e => setBody(e)}
        />
        <Button size="large" appearance="primary" float="right">
          Send Email
        </Button>
      </Pane>
    </Pane>
  );
}