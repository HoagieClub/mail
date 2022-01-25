import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import {
    RadioGroup, Text, Heading, Pane, majorScale, Spinner, Button,
} from 'evergreen-ui'
import Link from 'next/link';

export default function App() {
    const { user, isLoading } = useUser();
    // if (isLoading) { return <Spinner /> }

    const studentOrgLabel = (
        <Pane>
            <Text size={500}>
                <b>Student clubs or Departments</b>
                <br />
            </Text>
            <Text size={500}> Announcements on behalf of
                student clubs, departments, and
                Princeton-affiliated organizations.
            </Text>
        </Pane>
    )
    const lostFoundLabel = (
        <Pane>
            <Text size={500}> <b>Lost and Found Items</b><br /></Text>
            <Text size={500}>
                Announcements about found, lost, or stolen things.
            </Text>
        </Pane>
    )
    const sellabel = (
        <Pane>
            <Text size={500}> <b>Student sales</b><br /></Text>
            <Text size={500}> Announcements about items you are selling. </Text>
        </Pane>
    )
    const miscLabel = (
        <Pane>
            <Text size={500}> <b>Miscellaneous</b><br /></Text>
            <Text size={500}> Emails that do not fit into any of these categories </Text>
        </Pane>
    )

    const [options] = useState([
        { label: studentOrgLabel, value: 'studentorg' },
        { label: lostFoundLabel, value: 'lost' },
        { label: sellabel, value: 'sale' },
        { label: miscLabel, value: 'misc' },
    ])
    const [optionValue, setOptionValue] = useState('studentorg')

    const [miscOptions] = useState([
        { label: <b>Yes</b>, value: 'miscYes' },
        { label: <b>No</b>, value: 'miscNo' },
    ])
    const [miscValue, setMiscValue] = useState('miscYes')

    const misc = (
        <Pane>
            <Text
                size={500}
            > Is the message <b>urgent</b> and
                <b> benefits from being sent to all listservs </b>
                as opposed to just your own?
            </Text>
            <RadioGroup
                size={16}
                value={miscValue}
                options={miscOptions}
                isRequired
                marginTop={majorScale(3)}
                onChange={(event) => setMiscValue(event.target.value)}
            />
            <br />
        </Pane>
    )
    const bottomButtons = (
        <Pane>
            <Link href={optionValue === 'studentorg'
                ? '/send' : `/digest?type=${optionValue}`}
            >
                <Button size="large" appearance="primary" float="right">
                    Next
                </Button>
            </Link>
            <Link href="/">
                <Button size="large" float="left">Back</Button>
            </Link>

        </Pane>
    )
    const SelectForm = (
        <Pane marginBottom={majorScale(2)}>
            <Heading
                size={900}
                marginTop={majorScale(2)}
                marginBottom={majorScale(1)}
            >Hi, {user.name}
            </Heading>
            <Text
                size={500}
            > I would like to send an email about...
            </Text>

            <RadioGroup
                size={16}
                value={optionValue}
                options={options}
                isRequired
                marginTop={majorScale(3)}
                onChange={(event) => setOptionValue(event.target.value)}
            />

        </Pane>
    )

    return (
        <Pane
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginX={majorScale(1)}
            paddingBottom={majorScale(4)}
            paddingTop={majorScale(8)}
        >
            <Pane
                borderRadius={8}
                textAlign="left"
                elevation={1}
                background="white"
                marginX={20}
                maxWidth="600px"
                width="100%"
                paddingX={majorScale(4)}
                paddingTop={majorScale(2)}
                paddingBottom={majorScale(4)}
            >
                { SelectForm }
                {optionValue === 'misc' ? misc : null}
                {bottomButtons}
            </Pane>
        </Pane>
    );
}
