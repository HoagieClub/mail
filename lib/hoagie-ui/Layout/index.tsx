import { FC } from 'react'
import Nav from "../Nav"
import { Pane, useTheme } from "evergreen-ui"

interface LayoutProps {
    name: string;
}

const Layout:FC<LayoutProps> = ({children, name}) => {
    return (
        <Pane height="100%" background="blue100">
            <Nav name={name} />
            {children}
        </Pane>
    )
}

export default Layout