import Mail from "../../components/Mail";
import { useState } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(() => {
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const sendMail = async (mailData) => {
    const response = await fetch('/api/mail/send', {
        body: JSON.stringify(mailData),
        method: 'POST'
      });
    
    if (!response.ok) { 
      const errorText = await response.text();
      setErrorMessage(`There was an issue with your email. ${errorText}`);
    } else {
      setSuccess(true);
    }
  }
  return <Mail success={success} onError={setErrorMessage} onSend={sendMail} errorMessage={errorMessage} />;
});