import {React, useState, useEffect} from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import { Heading, Alert, TextInputField, Pane, majorScale, minorScale, Spinner, EnvelopeIcon, ArrowLeftIcon, Button } from 'evergreen-ui'
import Link from 'next/link';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0'

const senderNameDesc = `This will be the name of the sender displayed in the email. 
It is recommended that you do not change this. However, you could change this to e.g.
the name of the club advertising the event. Note that your real NetID will be included 
at the bottom of the email regardless of your display name.`;

export default function LostFound({ Component, pageProps }) {
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
            <Heading 
              size={800} 
              marginY={majorScale(2)}>Send an Email
            </Heading>
            <Alert 
              intent="none" 
              title="This message will be sent through the hoagiemail digest service.">
            Your message will be bundled with others in a weekly digest email. Earliest possible time this will be sent is at 12pm Jan 20th, 2021.
            </Alert><br />
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
            </Pane>
            </Pane>
  );
}