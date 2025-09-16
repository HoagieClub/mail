import { Button, Pane } from 'evergreen-ui';
import Link from 'next/link';

import formatDateString from '@/components/MailForm/ScheduledSend/formatDateString';

export default function SuccessPage({ digest = false, schedule = 'now' }) {
    return (
        <Pane
            display='flex'
            flexDirection='column'
            alignItems='center'
            paddingY={40}
        >
            <div className='success-animation'>
                <svg
                    className='checkmark'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 52 52'
                >
                    <circle
                        className='checkmark__circle'
                        cx='26'
                        cy='26'
                        r='25'
                        fill='none'
                    />
                    <path
                        className='checkmark__check'
                        fill='none'
                        d='M14.1 27.2l7.1 7.2 16.7-16.8'
                    />
                </svg>
            </div>
            <h1 className='h1'>Success!</h1>
            {!digest && schedule === 'now' && (
                <>
                    <Pane>
                        Your email has been sent to all students
                        and will be in your inbox shortly!
                        We ask that you do not send any additional emails
                        <b> for the next few days</b> to avoid spam.
                        <br /> <br />
                        Thank you for using Hoagie Mail! If you would like to
                        give feedback or are interested in our future projects,
                        feel free to contact us through {' '}
                        <b>
                            <a href='mailto:hoagie@princeton.edu'>
                                hoagie@princeton.edu
                            </a>
                        </b>
                        .
                    </Pane>
                    <Link href='/'>
                        <Button appearance='primary' marginTop='30px'>
                            Back
                        </Button>
                    </Link>
                </>
            )}
            {!digest && schedule !== 'now' && (
                <>
                    <Pane>
                        Your email has been successfully scheduled! It
                        will be sent to all students on
                        {` ${formatDateString(schedule)}`}. You can modify
                        the scheduled time or delete the email on the
                        Scheduled Emails page.
                        <br /> <br />
                        Thank you for using Hoagie Mail! If you would like to
                        give feedback or are interested in our future projects,
                        feel free to contact us through {' '}
                        <b>
                            <a href='mailto:hoagie@princeton.edu'>
                                hoagie@princeton.edu
                            </a>
                        </b>
                        .
                    </Pane>
                    <Link href='/'>
                        <Button appearance='primary' marginTop='30px'>
                            Back
                        </Button>
                    </Link>
                </>
            )}
            {digest && (
                <>
                    <Pane>
                        Your message has been added to the Hoagie Stuff Digest,
                        and will be included in the upcoming weekly digest
                        email. Digest emails are sent
                        <b>
                            at noon every Tuesday, Thursday, and Saturday
                        </b> so you can expect your message to be sent then.
                        <br /> <br />
                        Thank you for using Hoagie Mail! If you would like to
                        give feedback or are interested in our future projects,
                        feel free to contact us through {' '}
                        <b>
                            <a href='mailto:hoagie@princeton.edu'>
                                hoagie@princeton.edu
                            </a>
                        </b>
                        .
                    </Pane>
                    <Link href='/app'>
                        <Button appearance='primary' marginTop='30px'>
                            Back
                        </Button>
                    </Link>
                </>
            )}
        </Pane>
    );
}
