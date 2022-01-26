import { majorScale, Link, Heading, Card, Avatar, useTheme} from "evergreen-ui"

interface CardProps {
    /** authenticated user data */
    user: Object;
}

const ProfileCard = ({user}:CardProps) => {
    const theme = useTheme();
    const name = user.user ? (user.isLoading ? "Tammy Tiger" : user.user.name) : "Tammy Tiger";
    const email = user.user ? (user.isLoading ? "Tammy Tiger" : user.user.email) : "hoagie@princeton.edu";

    return (
        <Card elevation={1} background="gray50" padding={majorScale(3)}
        borderRadius={8} display="flex" flexDirection="column" alignItems="center">
            <Avatar name={name} color={theme.title} size={40}/>
            <Heading size={500} marginTop={majorScale(1)}>
                {name}
            </Heading>
            <Link href={"mailto:" + email} color="neutral" size={300}
            marginTop={2}>
                ({email})
            </Link>
        </Card>
    )
}

export default ProfileCard