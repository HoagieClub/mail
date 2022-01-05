import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import { Heading, Alert, TextInputField, Pane, majorScale, minorScale, Spinner, EnvelopeIcon, ArrowLeftIcon, Button } from 'evergreen-ui'
import Link from 'next/link';


import Head from 'next/head';

export default function Digest({ Component, pageProps }) {
  const tabs = [
    {title: "Send Mail", href: "/app"},
    {title: "Add to Digest", href: "/"}
  ];

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
            <Heading size={800} marginY={majorScale(2)}>Send an Email</Heading>
            <Alert intent="none" title="This message will be sent through the hoagiemail digest service.">
            Your message will be bundled with others in a weekly digest email. Earliest possible time this will be sent is at 12pm Jan 20th, 2021.
            </Alert><br />
            <TextInputField
            label="Name of Item Lost"
            // isInvalid={headerInvalid}
            required
            placeholder={"Item"}
            // validationMessage = {headerInvalid ? "Must have subject line" : null}
            // value={header}
            // onChange={e => setHeader(e.target.value)}
            />
            <TextInputField
            label="Displayed Sender Name"
            // isInvalid={headerInvalid}
            required
            description="This will be the name of the sender displayed in the email. 
            It is recommended that you do not change this. However, you could change this to e.g.
            the name of the club advertising the event. Note that your real NetID will be included 
            at the bottom of the email regardless of your display name."
            placeholder={"Name"}
            // validationMessage = {headerInvalid ? "Must have subject line" : null}
            // value={header}
            // onChange={e => setHeader(e.target.value)}
            />
            <TextInputField
            label="Description of Item"
            // isInvalid={headerInvalid}
            required
            placeholder={"Description"}
            // validationMessage = {headerInvalid ? "Must have subject line" : null}
            // value={header}
            // onChange={e => setHeader(e.target.value)}
            />
            <Pane>
            <Button size="large" appearance="primary" float="right">
              Submit
            </Button>
            <Button 
              // disabled={!editorCore.preview} 
              // onClick={() => {editorCore.preview()}} 
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