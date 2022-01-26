import { FC } from 'react'
import { Pane } from "evergreen-ui"

interface LayoutProps {
}

const Layout:FC<LayoutProps> = ({children}) => {
    return (
        <Pane height="100%" background="blue100">
            {children}
        </Pane>
    )
}

export default Layout