import { majorScale, Pane, Text, Position, Popover, Avatar, TabNavigation, Tab, useTheme } from "evergreen-ui"
import ProfileCard from '../ProfileCard'
import { ComponentType } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

interface NavProps {
     /** name of app for hoagie{name} title */
    name:string;
    /** custom component in place of the logo */
    logoComponent?: ComponentType;
     /** list of tab objects for navbar */
    tabs?: Array<any>;
     /** authenticated user data */
    user?: any;
}

const Nav = ({name, logoComponent, tabs=[], user}:NavProps) => {
    const theme = useTheme();
    const router = useRouter();
    const username = user.user ? (user.isLoading ? "Tammy Tiger" : user.user.name) : "Tammy Tiger";

    return (
        <Pane elevation={1}>
            <Pane width="100%" height={20} background="blue500"></Pane>
            <Pane display="flex" justifyContent="center" width="100%" height={majorScale(9)} background="white">
                <Pane 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="space-between"
                    width="100%" 
                    height="100%" 
                    maxWidth={1200} 
                    paddingX={majorScale(5)}
                    fontSize={25}
                >
                    <Link href="/">
                        <Pane cursor="pointer" className="hoagie">
                            {logoComponent ? logoComponent : <Pane>hoagie<b>{name}</b>
                            <Text className="beta" color="blue400">beta</Text></Pane>}
                        </Pane>
                    </Link>
                    <Pane display="flex" alignItems="center">
                        <TabNavigation>
                        {tabs.map((tab) => (
                            <Link href={tab.href} passHref>
                                <Tab key={tab.title} is="a" id={tab.title}
                                isSelected={router.pathname === tab.href} appearance="navbar">
                                {tab.title}
                                </Tab>
                            </Link>
                        ))}
                        </TabNavigation>
                        {user.user && <Popover
                            content={
                            <ProfileCard user={user}/>
                            }
                            position={Position.BOTTOM}
                        >
                             <Avatar name={username} style={{cursor:'pointer'}} color={theme.title} size={40} marginLeft={majorScale(4)}/>
                        </Popover> }
                    </Pane>
                </Pane>
            </Pane>
        </Pane>
    )
}

export default Nav