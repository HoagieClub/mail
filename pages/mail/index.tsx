import Mail from "./mail";

import { withPageAuthRequired } from '@auth0/nextjs-auth0';


export default withPageAuthRequired(() => {
  const sendMail = async (mailData) => {
    const response = await fetch('/api/mail/send', {
        body: JSON.stringify(mailData),
        method: 'POST'
      });
    const products = await response.text();
    console.log(products);
  }
  return <Mail onSend={sendMail} />;
});