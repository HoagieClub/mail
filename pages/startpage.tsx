import {React, useState, useEffect} from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import { InfoSignIcon, RadioGroup, Text, Dialog, Heading, Alert, TextInputField, Pane, majorScale, minorScale, Spinner, EnvelopeIcon, ArrowLeftIcon, Button } from 'evergreen-ui'
import Link from 'next/link';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0'

const senderNameDesc = `This will be the name of the sender displayed in the email. 
It is recommended that you do not change this.\n\n\n However, you could change this to e.g.
the name of the club advertising the event. Note that your real NetID will be included 
at the bottom of the email regardless of your display name.`;


export default function LostFound({ onSend, onError, errorMessage, success }) {
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
  const studentOrgLabel = <Pane>
    <Text size={500}> <b>Student organization event</b><br/></Text>
    <Text size={500}> These include events organized by registered clubs, departments, etc. </Text>
  </Pane>
  const lostFoundLabel = <Pane>
  <Text size={500}> <b>Lost and Found or Stolen Items</b><br/></Text>
  <Text size={500}> Items you have found or lost and want to make an announcement about. </Text>
  </Pane>
  const sellabel = <Pane>
  <Text size={500}> <b>Selling or request to buy</b><br/></Text>
  <Text size={500}> Items you are selling or want to buy. </Text>
  </Pane>
   const miscLabel = <Pane>
   <Text size={500}> <b>Miscellaneous</b><br/></Text>
   <Text size={500}> Emails that do not fit into any of these categories </Text>
 </Pane>

  const [options] = useState([
    { label: studentOrgLabel, value: 'studentorg' },
    { label: lostFoundLabel, value: 'lostfound' },
    { label: sellabel, value: 'sell' },
    { label: miscLabel, value: 'misc' }
  ])
  const [optionValue, setOptionValue] = useState('studentorg')

  const [miscOptions] = useState([
    { label: <b>Yes</b>, value: 'miscYes' },
    { label: <b>No</b>, value: 'miscNo' },
  ])
  const [miscValue, setMiscValue] = useState('miscYes')
  
  const misc = <Pane>
  <Text 
    size={500}
  > Is the message <b>urgent</b> and <b>benefits from being sent to all listservs</b> as opposed to just your own?</Text>
  <RadioGroup
    size={16}
    value={miscValue}
    options={miscOptions}
    isRequired
    marginTop={majorScale(3)}
    onChange={event => setMiscValue(event.target.value)}
  />
  <br/>
</Pane>
  const bottomButtons =    
  <Pane>
  <Link href="/app">
    <Button size="large" appearance="primary" float="right">
      Next
    </Button>
    </Link>
    <Link href="/">
      <Button size="large" float="left">Back</Button>
    </Link>
          
  </Pane>

  useEffect( () => {
    if (name == "") setFilled(true);
    if (filled) setNameInvalid(name == "");
    if (desc == "") setFilledDesc(true);
    if (filledDesc) setDescInvalid(desc == "");
    setSenderInvalid(sender == "");
  }, [name, sender, desc]);
  
  const MailForm = <Pane marginBottom={majorScale(2)}>
    <Heading 
      size={900} 
      marginTop={majorScale(2)}
      marginBottom={majorScale(1)}>Hi, {isLoading ? "Tammy Tiger": user.name}
    </Heading>
    <Text 
      size={500}
    > Tell use what you would like to send... </Text>

    <RadioGroup
      size={16}
      value={optionValue}
      options={options}
      isRequired
      marginTop={majorScale(3)}
      onChange={event => setOptionValue(event.target.value)}
    />
    <br/>
  
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
            { success ? SuccessPage : MailForm }
            {optionValue == "misc" ? misc : null}
            {bottomButtons}
        </Pane>
    </Pane>
  );
}