import { Pane, majorScale } from 'evergreen-ui'
import Link from 'next/link'


export default function Footer() {
    return (
    <Pane display="flex" justifyContent="center" alignItems="center"  width="100%" fontSize="16pt" marginX={majorScale(1)}> 
        <Pane maxWidth="600px" >
        <p>
        Hoagie Mail was built by Princeton students as part of Hoagie Club. <b><u><Link href='https://tally.so/r/mRzdlm'>Have any feedback? Let us know.</Link></u></b>
        </p>
       </Pane>
    </Pane>
    )
}

