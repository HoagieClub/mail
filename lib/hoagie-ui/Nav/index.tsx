import { majorScale, Pane, Text, Avatar, TabNavigation, Tab, useTheme } from "evergreen-ui"
import { ComponentType } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

interface NavProps {
    /** the name of the hoagie project */
    name:string;
    /** custom component in place of the logo */
    logoComponent?: ComponentType;
     /** list of tab objects for navbar */
    tabs?: Array<Object>;
}

const Nav = ({name, logoComponent, tabs=[]}:NavProps) => {
    const theme = useTheme();
    const router = useRouter();

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
                        {tabs.map((tab, index) => (
                            <Link href={tab.href} passHref>
                                <Tab key={tab.title} is="a" id={tab.title}
                                isSelected={router.pathname === tab.href} appearance="navbar">
                                {tab.title}
                                </Tab>
                            </Link>
                        ))}
                        </TabNavigation>
                        <Avatar name={"Tammy Tiger"} color={theme.title} size={40} marginLeft={majorScale(4)}/>
                    </Pane>
                </Pane>
            </Pane>
        </Pane>
    )
}

export default Nav