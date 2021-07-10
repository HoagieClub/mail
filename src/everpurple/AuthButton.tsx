import { Button, Pane, majorScale, minorScale } from "evergreen-ui"

const AuthButton = (props) => {
    const logo = <h2 style={{
        fontSize:"30px", 
        paddingRight: 20}} className="hoagie-logo">h</h2>
    const hoagieProfile = <Pane marginLeft={minorScale(1)} className="hoagie">
        hoagie<b>profile</b></Pane>


    return (
        <a href={props.logout ? "/api/auth/logout" : "/api/auth/login"}>
        <Button 
            marginRight={16} 
            height={56}
            width={majorScale(35)}
            background="purple600"
            appearance="primary" 
        >
            { logo }
            {!props.logout && <Pane display="flex">Login using {hoagieProfile}
            </Pane>}
            {props.logout && <Pane display="flex">Logout from {hoagieProfile}</Pane>}
        </Button>
        </a>
    )
}

export default AuthButton