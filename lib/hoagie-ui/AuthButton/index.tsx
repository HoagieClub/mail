import { Button, Pane, majorScale, minorScale } from "evergreen-ui"

interface AuthButtonProps {
    /** defines whether the button is for "login" or "logout" */
    variant?: string;
    /** optional custom url to direct; uses API endpoints by default */
    href?: string;
}

/** AuthButton is a button meant for logins and logout throughout
 * different Hoagie applications.
 */
const AuthButton = ({
    variant = "login", 
    href = "",
    }:AuthButtonProps) => {
    const logo = 
    <h2 style={{
        fontSize:"30px", 
        paddingRight: 20}} 
        className="hoagie">
        <b>    h </b>
    </h2>
    const isLogout = variant === "logout";

    if (href === "") {
        href = isLogout ? "/api/auth/logout" : "/api/auth/login"
    }
    return (
        <a href={href}>
        <Button 
            height={56}
            width={majorScale(35)}
            background="purple600"
            appearance={isLogout ? "default" : "primary"}
        >
            { logo }
            <Pane display="flex" className="hoagie">
                { isLogout ? "Logout from" : "Login using" } 
                <Pane marginLeft={minorScale(1)}>
                    hoagie<b>profile</b>
                </Pane>
            </Pane>
        </Button>
        </a>
    )
}

export default AuthButton