import { majorScale, Pane } from "evergreen-ui"

const Nav = () => {
    return (
        <Pane elevation={1}>
            <Pane width="100%" height={20} background="purple600"></Pane>
            <Pane display="flex" justifyContent="center" width="100%" height={majorScale(9)} background="white">
                <Pane display="flex" alignItems="center" width="100%" height="100%" maxWidth={1200} paddingX={20}>
                    <h2>hoagie<b>mail</b></h2>
                </Pane>
            </Pane>
        </Pane>
    )
}

export default Nav