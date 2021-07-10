import Nav from "./Nav"
import { Pane } from "evergreen-ui"

const Layout = (props) => {
    return (
        <Pane height="100%">
            <Nav />
            {props.children}
        </Pane>
    )
}

export default Layout