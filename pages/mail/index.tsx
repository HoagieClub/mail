import Mail from "./mail";
import { useState } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';


export default withPageAuthRequired(() => {
  const [errorMessage, setErrorMessage] = useState("")
  const sendMail = async (mailData) => {
    const response = await fetch('/api/mail/send', {
        body: JSON.stringify(mailData),
        method: 'POST'
      });
    if (response.status != 202) { 
      setErrorMessage(response.statusText);
    }
  }
  return <Mail onSend={sendMail} errorMessage={errorMessage} />;
});