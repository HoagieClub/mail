import { majorScale, Button, Link, Heading, Card, Avatar, useTheme} from "evergreen-ui"

interface CardProps {
    /** authenticated user data */
    user: any;
}

/** ProfileCard is a profile card meant for display of user information
 *  throughout different Hoagie applications.
 */
function ProfileCard({ user }:CardProps) {
    const theme = useTheme();

    const name = user?.user ? (user.isLoading ? 'Tammy Tiger' : user.user.name) : 'Tammy Tiger';
    const email = user?.user ? (user.isLoading ? 'Tammy Tiger' : user.user.email) : 'hoagie@princeton.edu';

    return (
        <Card
            elevation={1}
            background="gray50"
            padding={majorScale(3)}
            maxWidth={majorScale(30)}
            borderRadius={8}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Avatar name={name} color={theme.title} size={40} />
            <Heading size={500} marginTop={majorScale(1)}>
                {name}
            </Heading>
            <Link
                href={`mailto:${email}`}
                color="neutral"
                size={300}
                marginTop={2}
            >
                ({email})
            </Link>
            <a href="/api/auth/logout"><Button marginTop={16}>Log Out</Button></a>
        </Card>
    )
}

export default ProfileCard
