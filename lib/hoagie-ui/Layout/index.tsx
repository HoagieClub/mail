import { FC } from 'react'
import Nav from "../Nav"
import { Pane, useTheme } from "evergreen-ui"

interface LayoutProps {
    /** name of app for hoagie{name} title */
    name: string;
    /** list of tab objects for navbar */
    tabs?: Array<Object>;
}

const Layout:FC<LayoutProps> = ({children, name, tabs = []}) => {
    return (
        <Pane height="100%" background="blue100">
            <Nav name={name} tabs={tabs}/>
            {children}
        </Pane>
    )
}

export default Layout