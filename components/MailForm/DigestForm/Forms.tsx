import { useState, useEffect, useRef } from 'react';

import {
    Pane,
    TextInputField,
    TextareaField,
    Image,
    FilePicker,
    FormField,
    Checkbox,
    RadioGroup,
} from 'evergreen-ui';

import ErrorMessage from '@/components/ErrorMessage';

function LostAndFoundForm({
    name,
    setName,
    desc,
    setDesc,
    thumbnail,
    setThumbnail,
    setTags,
}) {
    const [nameInvalid, setNameInvalid] = useState(false);
    const [descInvalid, setDescInvalid] = useState(false);
    const hasInteractedName = useRef(false);
    const hasInteractedDesc = useRef(false);
    const [errorText, setError] = useState('');
    const [tag, setTag] = useState('lost');
    const [tagOptions] = useState([
        { label: 'Lost', value: 'lost' },
        { label: 'Found', value: 'found' },
    ]);

    const uploadImage = async (files) => {
        const body = new FormData();
        body.append('image', files[0]);
        const res = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID 197e34bb1737a08',
            },
            body,
        });
        const imageRequest = await res.json();
        if (imageRequest.success) {
            setThumbnail(imageRequest.data.link);
        } else {
            setError(
                'Error occured with your image upload. Please ensure your file is correct.'
            );
        }
    };

    useEffect(() => {
        if (!hasInteractedName.current && name !== '') {
            hasInteractedName.current = true;
        }
        if (!hasInteractedDesc.current && desc !== '') {
            hasInteractedDesc.current = true;
        }
        if (hasInteractedName.current) {
            setNameInvalid(name === '');
        }
        if (hasInteractedDesc.current) {
            setDescInvalid(desc === '');
        }
    }, [name, desc]);
    return (
        <Pane>
            <ErrorMessage text={errorText} />
            {thumbnail && (
                <Pane
                    display='flex'
                    justifyContent='center'
                    marginTop={10}
                    marginBottom={30}
                >
                    <Image src={thumbnail} height={200} />
                </Pane>
            )}
            <FormField
                marginTop={24}
                label='Lost or Found?'
                description='Did you lose or find an item?.'
                required
            />
            <RadioGroup
                isRequired
                size={16}
                value={tag}
                options={tagOptions}
                onChange={(event) => {
                    setTag(event.target.value);
                    setTags([event.target.value]);
                }}
            />
            <TextInputField
                label='Item'
                marginTop={20}
                isInvalid={nameInvalid}
                required
                placeholder='A yellow leather wallet.'
                description='For example, A yellow leather wallet'
                validationMessage={
                    nameInvalid ? 'Must have an item name' : null
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextareaField
                label='Details'
                isInvalid={descInvalid}
                required
                placeholder='I was in the Whitman Dining Hall when
                my yellow leather wallet went missing. It has a WaWa membership
                card and a sticker of a sandwich on it.'
                description='Some details about the item.'
                validationMessage={
                    descInvalid ? 'Must have a description' : null
                }
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            <FormField
                marginTop={24}
                label='Item Photo (optional)'
                description='Upload a photo of the item. Note we will only include
                a link to the photo rather than the photo itself in the email; the
                photo will be accessible on the internet.'
                required
            />
            <FilePicker
                id='event-image'
                name='Picture of the Item'
                onChange={uploadImage}
                placeholder='Select image here!'
                required
                marginBottom={30}
            />
        </Pane>
    );
}

function SaleForm({ desc, setDesc, link, setLink, setTags }) {
    const [descInvalid, setDescInvalid] = useState(false);
    const hasInteractedDesc = useRef(false);

    const [categories, setCategories] = useState({
        Accessories: false,
        Clothing: false,
        Tech: false,
        Furniture: false,
        School: false,
        Tickets: false,
        Other: false,
    });
    const salesCategories = Object.keys(categories);

    useEffect(() => {
        if (!hasInteractedDesc.current && desc !== '') {
            hasInteractedDesc.current = true;
        }

        if (hasInteractedDesc.current) {
            setDescInvalid(desc === '');
        }
    }, [desc]);

    return (
        <Pane>
            <TextareaField
                label='Sale Details'
                isInvalid={descInvalid}
                required
                placeholder='Selling some old jackets and some shoes that I
                no longer use, many in great condition; prices negotiable.
                See the Google Slides link for more details.'
                description='Brief details about the sale. (<200 characters)'
                validationMessage={
                    descInvalid ? 'Must have a description' : null
                }
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            <TextInputField
                label='Google Slides URL (recommended)'
                placeholder='https://docs.google.com/presentation/d/1234'
                description='If your sale is on Google Slides,
                you may copy paste your URL here.
                Make sure it starts with https://docs.google.com/'
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <FormField
                marginTop={24}
                label='Tags'
                description='Select the tags of things you are selling.'
                required
            />
            {salesCategories.map((category) => (
                <Checkbox
                    key={category}
                    label={category}
                    checked={categories[category]}
                    onChange={(e) => {
                        const newCategories = {
                            ...categories,
                        };
                        newCategories[category] = e.target.checked;
                        setCategories(newCategories);
                        // Get selected categories by looking at object entites
                        // as array of type [key, value], if value is true
                        // then keep in the array and only consider [0] which is the
                        // key
                        const selectedCat = Object.entries(newCategories)
                            .filter((c: [string, boolean]) => c[1])
                            .flatMap((c: [string, boolean]) =>
                                c[0].toLowerCase()
                            );
                        setTags(selectedCat);
                    }}
                />
            ))}
        </Pane>
    );
}

function GenericForm({ name, setName, desc, setDesc, setTags }) {
    const [nameInvalid, setNameInvalid] = useState(false);
    const [descInvalid, setDescInvalid] = useState(false);
    const hasInteractedName = useRef(false);
    const hasInteractedDesc = useRef(false);
    // Only one tag for generic form
    const [tag, setTag] = useState('announcement');
    const [tagOptions] = useState([
        { label: 'Announcement', value: 'announcement' },
        { label: 'Opportunity', value: 'opportunity' },
        { label: 'Request', value: 'request' },
    ]);

    useEffect(() => {
        if (!hasInteractedName.current && name !== '') {
            hasInteractedName.current = true;
        }
        if (!hasInteractedDesc.current && desc !== '') {
            hasInteractedDesc.current = true;
        }
        if (hasInteractedName.current) {
            setNameInvalid(name === '');
        }
        if (hasInteractedDesc.current) {
            setDescInvalid(desc === '');
        }
    }, [name, desc]);
    return (
        <Pane>
            <TextInputField
                label='Title'
                isInvalid={nameInvalid}
                required
                description='Title of your message'
                validationMessage={
                    nameInvalid ? 'Must have an item name' : null
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextareaField
                label='Message Content'
                isInvalid={descInvalid}
                required
                description='The content of your message. (<200 characters)'
                validationMessage={
                    descInvalid ? 'Must have a description' : null
                }
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            <FormField
                marginTop={24}
                label='Tag'
                description='Select what tag describes your message best.'
                required
            />
            <RadioGroup
                isRequired
                size={16}
                value={tag}
                options={tagOptions}
                onChange={(event) => {
                    setTag(event.target.value);
                    setTags([event.target.value]);
                }}
            />
        </Pane>
    );
}

export { LostAndFoundForm, SaleForm, GenericForm };
