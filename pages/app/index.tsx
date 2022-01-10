import Mail from "../../components/Mail";
import { useEffect, useState } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import router from "next/router";

export default withPageAuthRequired(() => {
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const sendMail = async (mailData) => {
    const response = await fetch('/api/hoagie/mail/send', {
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
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    if (queryParams.has('code')) {
      queryParams.delete('code')
      queryParams.delete('state')
      // TODO: add support for other params to persist using 
      // queryParam.toString() or remove the queryParams method
      router.replace("/app", undefined, { shallow: true })
    }
  }, [])
  return <Mail success={success} onError={setErrorMessage} onSend={sendMail} errorMessage={errorMessage} />;
});