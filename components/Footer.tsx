import { Pane, majorScale } from 'evergreen-ui'
import Link from 'next/link'


export default function Footer() {
    return (
    <Pane display="flex" justifyContent="center" height="100px" paddingBottom="30px" alignItems="center" fontSize="14pt" marginX={majorScale(1)}> 
        <Pane maxWidth="600px" >
        Hoagie Mail was built by Princeton students as part of Hoagie Club. Interested in working on projects like this? <b><u><Link href='https://club.hoagie.io'>Join Hoagie Club!</Link></u></b>
       </Pane>
    </Pane>
    )
}

