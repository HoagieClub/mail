import { majorScale, Pane, Text, Position, Popover, Avatar, TabNavigation, Tab, useTheme } from "evergreen-ui"
import ProfileCard from '../ProfileCard'
import { ComponentType } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

interface NavProps {
    /** name of app for hoagie{name} title */
    name: string;
    /** custom component in place of hoagie logo */
    LogoComponent?: ComponentType;
    /** custom component in place of header color strip */
    HeaderComponent?: ComponentType;
    /** list of tab objects for navbar, with title and href fields */
    tabs?: Array<any>;
    /** authenticated user data */
    user?: any;
    /** show 'beta' development disclaimer on hoagie app logo  */
    beta?: boolean;
}

/** Nav is a navbar meant for internal navigations throughout
 *  different Hoagie applications.
 */
const Nav = ({name, LogoComponent, HeaderComponent, tabs=[], user, beta=false}:NavProps) => {
    const theme = useTheme();
    const router = useRouter();
    const username = user?.user ? (user.isLoading ? "Tammy Tiger" : user.user.name) : "Tammy Tiger";

    return (
        <Pane elevation={1}>
            {HeaderComponent ? <HeaderComponent /> : <Pane width="100%" height={20} background="blue500"></Pane>}
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
                        <Pane cursor="pointer" position="relative">
                          {LogoComponent ? LogoComponent : <Pane>
                          <Text is="h2" display="inline-block" className="hoagie logo" color="grey900">hoagie</Text>
                          <Text is="h2" display="inline-block" className="hoagie logo" color="blue500">{name}</Text>
                          {beta && <Text className="hoagie beta" position="absolute" color="grey900">(BETA)</Text>}
                          </Pane>}
                        </Pane>
                    </Link>
                    <Pane display="flex" alignItems="center">
                        <TabNavigation>
                        {tabs.map((tab) => (
                            <Link href={tab.href} passHref>
                                <Tab key={tab.title} is="a" id={tab.title}
                                isSelected={router?.pathname === tab.href} appearance="navbar">
                                {tab.title}
                                </Tab>
                            </Link>
                        ))}
                        </TabNavigation>
                        {user?.user && <Popover
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
