import { useEffect, useState, createRef } from 'react'
import RichTextEditor from "./RichSunEditor"
import { useUser } from '@auth0/nextjs-auth0'
import { Pane, majorScale, Spinner, Button, Alert, TextInputField, Dialog, Text, InfoSignIcon, TickCircleIcon } from 'evergreen-ui'
import Link from 'next/link';

const senderNameDesc = `This will be the name of the sender displayed in the email. 
It is recommended that you do not change this. However, you could change this to e.g.
the name of the club advertising the event. Note that your real NetID will be included 
at the bottom of the email regardless of your display name.`;

export default function Mail({ onSend, onError, errorMessage, success }) {
  const { user, isLoading } = useUser();
  if (isLoading)
    return <Spinner />

  const [header, setHeader] = useState('Hi from Hoagie!')
  const [headerInvalid, setHeaderInvalid] = useState(false)
  const [editorCore, seteditorCore] = useState({preview: null})
  const [sender, setSender] = useState(user.name)
  const [senderInvalid, setSenderInvalid] = useState(false)
  const [body, setBody] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const listservs = ['Butler', 'First', 'Forbes', 'Mathey', 'Rockefeller', 'Whitman'];
  const [listservOptions] = useState(listservs.map((label) => ({
      label,
      value: label,
    }))
  )

  // const ListServSelect = () => {
  //   const [selectedItemsState, setSelectedItems] = useState(listservs)
  //   const [selectedItemNamesState, setSelectedItemNames] = useState('All listservs selected...')
  //   return <SelectMenu
  //       isMultiSelect
  //       title="Select listservs to send."
  //       options={listservOptions}
  //       selected={selectedItemsState}
  //       onSelect={(item) => {
  //         const selected = [...selectedItemsState, item.value]
  //         const selectedItems = selected
  //         const selectedItemsLength = selectedItems.length
  //         let selectedNames = ''
  //         if (selectedItemsLength === 0) {
  //           selectedNames = ''
  //         } else if (selectedItemsLength == listservs.length) {
  //           selectedNames = 'All listservs selected...'
  //         } else if (selectedItemsLength === 1) {
  //           selectedNames = selectedItems.toString()
  //         } else if (selectedItemsLength > 1) {
  //           selectedNames = selectedItemsLength.toString() + ' selected...'
  //         }
  //         setSelectedItems(selectedItems)
  //         setSelectedItemNames(selectedNames)
  //       }}
  //       onDeselect={(item) => {
  //         const deselectedItemIndex = selectedItemsState.indexOf(item.value)
  //         const selectedItems = selectedItemsState.filter((_item, i) => i !== deselectedItemIndex)
  //         const selectedItemsLength = selectedItems.length
  //         let selectedNames = ''
  //         if (selectedItemsLength === 0) {
  //           selectedNames = ''
  //         } else if (selectedItemsLength == listservs.length) {
  //           selectedNames = 'All listservs selected...'
  //         } else if (selectedItemsLength === 1) {
  //           selectedNames = selectedItems.toString()
  //         } else if (selectedItemsLength > 1) {
  //           selectedNames = selectedItemsLength.toString() + ' listservs...'
  //         }

  //         setSelectedItems(selectedItems)
  //         setSelectedItemNames(selectedNames)
  //       }}
  //       >
  //       <Button marginBottom={20}>{selectedItemNamesState || 'Select multiple...'}</Button>
  //   </SelectMenu>
  // };
  const getEditor = (sunEditor) => {
    seteditorCore(sunEditor.core)
  };
  useEffect( () => {
    setHeaderInvalid(header == "");
    setSenderInvalid(sender == "");
  }, [header, sender]);

  const MailForm = <Pane>
    <h2 className='h2'>Send an Email</h2>
      { errorMessage && <Alert
        intent="danger"
        title="Error occured."
        marginY={20}
        >
          { errorMessage }
        </Alert> }
      <TextInputField
        label="Email Header"
        isInvalid={headerInvalid}
        required
        description={`This the title of the email that will be sent to the listservs.`}
        placeholder={"Hi from Hoagie!"}
        validationMessage = {headerInvalid ? "Must have subject line" : null}
        value={header}
        onChange={e => setHeader(e.target.value)}
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
      <RichTextEditor 
        onChange={(content)=>setBody(content)}
        onError={onError}
        label="Body Content"
        required
        getEditor={getEditor}
        placeholder="Hello there!"
        description={`
        This is the content of your email.
        Please use the "Image" icon below to add your images to make sure they appear in your email instead of
        copy-pasting. We also recommend keeping images small to make sure they do not appear gigantic in the email (the preview can be misleading).
        Note that images added to the email are uploaded to Imgur and are public. `}
      />
      <Pane>
      <Button onClick={()=>setShowConfirm(true)} size="large" appearance="primary" float="right">
        Send Email
      </Button>
      <Button 
        disabled={!editorCore.preview} 
        onClick={() => {editorCore.preview()}} 
        size="large" 
        appearance="default"
        float="right"
        marginRight="8px"
      >
        See Preview
      </Button>
      <Link href="/">
        <Button size="large" float="left">Back</Button>
      </Link>
      
      </Pane>
    <Dialog
      isShown={showConfirm}
      hasHeader={false}
      hasClose={false}
      onConfirm={async () => {
        await onSend({sender, header, body});
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
        <InfoSignIcon marginRight={10} /> You are about to send an email to all undergraduates at Princeton.
      </Pane>
      <Text>
      Once you click "Send Email", Hoagie will send the email to <b>all residential college listservs on your behalf</b>. 
      Your NetID will be included at the bottom of the email regardless of the content.
      </Text>
      <Alert
        intent="warning"
        title="Use this tool responsibly"
        marginTop={20}
        >
          Hoagie Mail sends out emails instantly, but if the tool is used to send offensive,
          intentionally misleading or harmful emails, the user will be banned from the platform
          and, if necessary, reported to the University.
        </Alert>
    </Dialog>
  </Pane>;

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
          { success ? SuccessPage : MailForm }
      </Pane>
    </Pane>
  );
}
