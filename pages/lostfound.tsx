import {useState, useEffect} from 'react';
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0';
import MailForm from "../components/MailForm";
import router from "next/router";

export default withPageAuthRequired(() => {
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const [digestWarn, setDigestWarn] = useState(false)
    const addDigest = async (digestData) => {
      const response = await fetch('/api/hoagie/mail/digest', {
          body: JSON.stringify(digestData),
          method: 'POST'
        });
      
      if (!response.ok) { 
        const errorText = await response.text();
        setErrorMessage(`There was an issue with your email. ${errorText}`);
      } else {
        setSuccess(true);
      }
    }

    const getDigestStatus = async () => {
      const response = await fetch('/api/hoagie/mail/digest');

      if (!response.ok) { 
        const errorText = await response.text();
        setErrorMessage(`There was an issue with fetching your Digest data. ${errorText}`);
      } else {
        // More in depth checking of response needed; should Digest data also be obtained here then passed into MailForm as a prop?
        setDigestWarn(true);
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

    //getDigestStatus();

    return <MailForm success={success} onError={setErrorMessage} onSend={addDigest} errorMessage={errorMessage} digestWarn={digestWarn}/>;
  });