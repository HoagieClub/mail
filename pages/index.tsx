import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import { Pane, majorScale, Spinner, ChatIcon } from 'evergreen-ui'
import AuthButton from '../src/everpurple/AuthButton'

export default function Index() {
  const { user, error, isLoading } = useUser();
  let Profile;
  if (isLoading) Profile = <Spinner />;
  else if (error) Profile = <div>{error.message}</div>;
  else if (user) Profile = <Pane>
      <hr/>
      <h2>Welcome {user.name}!</h2>
      <p>This is just a demo but thank you for trying it out.</p>
      <AuthButton logout={true} />
    </Pane>;
  else Profile = <AuthButton />

  const router = useRouter()
  useEffect(() => {
      const queryParams = new URLSearchParams(location.search)

      if (queryParams.has('code')) {
        queryParams.delete('code')
        queryParams.delete('state')
        // TODO: add support for other params to persist using 
        // queryParam.toString() or remove the queryParams method
        router.replace("/", undefined, { shallow: true })
      }
    }, [])
    return (
      <Pane display="flex" justifyContent="center" alignItems="center" 
      marginX={majorScale(1)}
      paddingBottom={majorScale(10)}
      paddingTop={majorScale(8)}
      >
        <Pane 
            borderRadius={20} 
            textAlign="center" 
            elevation={1} 
            background="white" 
            marginX={20} 
            maxWidth="600px" 
            width="100%"
            paddingX="10px"
            paddingTop={majorScale(5)}
            paddingBottom={majorScale(7)}>
            <ChatIcon size={100} color="gray800"/>
            <h1>Send email to everyone<br></br>on campus, <b>instantly</b>.</h1>
          <p>No more mail forwarding necessary.</p>
          <div>
          <Pane 
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginTop="30px"
          >
          { Profile }
          </Pane>
        </div>
        </Pane>
      </Pane>
    );
}