import {React, useState, useEffect} from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import { Strong, InfoSignIcon, Text, Dialog, Heading, Alert, TextInputField, Pane, majorScale, minorScale, Spinner, EnvelopeIcon, ArrowLeftIcon, Button, Paragraph } from 'evergreen-ui'
import Link from 'next/link';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0';

const senderNameDesc = `This will be the name of the sender displayed in the email. 
It is recommended that you do not change this. However, you could change this to e.g.
the name of the club advertising the event. Note that your real NetID will be included 
at the bottom of the email regardless of your display name.`;

export default function LostFound({ onSend, onError, errorMessage, success, digestWarn }) {
  const { user, isLoading } = useUser();
  if (isLoading)
    return <Spinner />

  const [name, setName] = useState('')
  const [nameInvalid, setNameInvalid] = useState(false)
  const [sender, setSender] = useState(user.name)
  const [senderInvalid, setSenderInvalid] = useState(false)
  const [filled, setFilled] = useState(false);
  const [filledDesc, setFilledDesc] = useState(false);
  const [desc, setDesc] = useState('')
  const [descInvalid, setDescInvalid] = useState(false)
  const [body, setBody] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)


  useEffect( () => {
    if (name == "") setFilled(true);
    if (filled) setNameInvalid(name == "");
    if (desc == "") setFilledDesc(true);
    if (filledDesc) setDescInvalid(desc == "");
    setSenderInvalid(sender == "");
  }, [name, sender, desc]);

  const DigestWarning = <Pane>
    <Heading 
      size={800} 
      marginY={majorScale(2)}>Your Current Digest Message:
    </Heading>
    <Text>
    This message will be sent to all listservs at <b>12 pm January 20th, 2022</b>
    </Text>
    <Pane marginTop={20} display="flex" alignItems="center" justifyContent="center" border="default">
    <Pane margin={20} >
    <Text><b>Title:</b> Title Here.</Text>
    <br />
    <Text><b>Category:</b> Lost & Found</Text>
    <br />
    <Text><b>Contact:</b>  Name Lastname (test@princeton.edu)</Text>
    <br />
    <br />
    <Text><b>Description:</b></Text>
    <br />
    <Text>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available</Text>
    </Pane>
    </Pane>
    <Alert 
      intent="none" 
      title="Want to include another message?"
      marginTop={20}
      >
      You can only have one digest email at a time. If you would like to
      make a new one or edit it, you will need to delete the current
      request and re-do it. After deletion, your current message will not
      be sent but you may create a new Digest Message to be sent in a future  
    </Alert>
    <br />
    <Pane>
      <Button size="large" appearance="primary" float="right">
        Delete
      </Button>
      <Link href="/">
        <Button size="large" float="left">Back</Button>
      </Link>      
    </Pane>
  </Pane>

  const MailForm = <Pane>
    <Heading 
      size={800} 
      marginY={majorScale(2)}>Send an Email
    </Heading>
    <Alert 
      intent="none" 
      title="This message will be sent through the hoagiemail digest service.">
      Your message will be bundled with others in a weekly digest email. Earliest possible time this will be sent is at 12pm Jan 20th, 2021.
    </Alert>
    <br />
    <TextInputField
      label="Name of Item Lost"
      isInvalid={nameInvalid}
      required
      placeholder={"Item"}
      validationMessage = {nameInvalid ? "Must have an item name" : null}
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <TextInputField
      label="Displayed Sender Name"
      required
      isInvalid={senderInvalid}
      description={senderNameDesc}
      placeholder={isLoading ? "Tammy Tiger": user.name}
      validationMessage = {senderInvalid ? "Must have sender name" : null}
      value={sender}
      onChange={e => setSender(e.target.value)}
    />
    <TextInputField
    label="Description of Item"
    isInvalid={descInvalid}
    required
    placeholder={"Description"}
    validationMessage = {descInvalid ? "Must have a description" : null}
    value={desc}
    onChange={e => setDesc(e.target.value)}
    />

    {/*Add functionality for onSend here*/}

    <Pane>
      <Button size="large" appearance="primary" float="right">
        Submit
      </Button>
      <Button 
        size="large" 
        appearance="default"
        float="right"
        marginRight="8px"
      >
        Cancel
      </Button>
      <Link href="/">
        <Button size="large" float="left">Back</Button>
      </Link>      
    </Pane>
    <br/>
    <Dialog
      isShown={showConfirm}
      hasHeader={false}
      hasClose={false}
      onConfirm={async () => {
        await onSend({sender, name, desc});
        setShowConfirm(false);
      }}
      onCloseComplete={() => setShowConfirm(false)}
      confirmLabel="Send Email"
      intent="warning"
    >
      <Pane
        marginTop={35}
        marginBottom={20}
        fontFamily="Nunito"
        display="flex"
        alignItems="center"
      >
        <InfoSignIcon marginRight={10} /> You are about to add your message to the weekly Hoagie Mail Digest service.
      </Pane>
      <Text>
      Once you click "Submit", Hoagie will append your message in the upcoming weekly digest email. This is sent to <b>all residential college listservs on your behalf</b>. 
      Your NetID will be included with your message regardless of the content.
      </Text>
      <Alert
        intent="warning"
        title="Use this tool responsibly"
        marginTop={20}
        >
          If Hoagie Mail Digest is used to send offensive,
          intentionally misleading or harmful messages, the user will be banned from the platform
          and, if necessary, reported to the University.
        </Alert>
    </Dialog>
  </Pane>

  const SuccessPage = <Pane 
    display="flex"
    flexDirection="column"
    alignItems="center"
    paddingY={40}
  >
    <div className="success-animation">
      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
    </div>
    <h1 className="h1">Success!</h1>
    <Pane>
      Your email has been sent to all undergraduate students and will be in your inbox shortly! We ask that you do not send any additional emails <b>for the next 24 hours</b> to avoid spam.
      <br /> <br />
      Thank you for using Hoagie Mail! If you would like to give feedback or are interested in our future projects, feel free to contact us through <b><a href="mailto:hoagie@princeton.edu">hoagie@princeton.edu</a></b>.
    </Pane>
    <a href="https://hoagie.io/"><Button appearance="primary" marginTop="30px">Back to hoagieplatform</Button></a>
  </Pane>

  return (
    <Pane display="flex" justifyContent="center" alignItems="center" 
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
            paddingBottom={majorScale(4)}>
            { digestWarn ? MailForm : DigestWarning }
        </Pane>
    </Pane>
  );
}