import {
    Pane, TextInputField,
    TextareaField, Image,
    FilePicker, FormField,
    Checkbox, Text, Strong,
} from 'evergreen-ui';
import { useState, useEffect } from 'react';
import ErrorMessage from '../../ErrorMessage';

function LostAndFoundForm({
    name, setName,
    desc, setDesc,
    thumbnail, setThumbnail,
}) {
    const [nameInvalid, setNameInvalid] = useState(false)
    const [descInvalid, setDescInvalid] = useState(false)
    const [filled, setFilled] = useState(false);
    const [filledDesc, setFilledDesc] = useState(false);
    const [errorText, setError] = useState('')

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
            setThumbnail(imageRequest.data.link)
        } else {
            // eslint-disable-next-line max-len
            setError('Error occured with your image upload. Please ensure your file is correct.')
        }
    }

    useEffect(() => {
        if (name === '') setFilled(true);
        if (filled) setNameInvalid(name === '');
        if (desc === '') setFilledDesc(true);
        if (filledDesc) setDescInvalid(desc === '');
    }, [name, desc]);
    return (
        <Pane>
            <ErrorMessage text={errorText} />
            { thumbnail
            && (
                <Pane
                    display="flex"
                    justifyContent="center"
                    marginTop={10}
                    marginBottom={30}
                >
                    <Image
                        src={thumbnail}
                        height={200}
                    />
                </Pane>
            )}
            <TextInputField
                label="Title"
                isInvalid={nameInvalid}
                required
                placeholder="Lost a yellow leather wallet."
                description="For example, Lost a yellow leather wallet"
                validationMessage={nameInvalid ? 'Must have an item name' : null}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextareaField
                label="Description of Item"
                isInvalid={descInvalid}
                required
                placeholder="I was in the Whitman Dining Hall when
                my yellow leather wallet went missing. It has a WaWa membership
                card and a sticker of a sandwich on it."
                description="Some details about the item."
                validationMessage={descInvalid ? 'Must have a description' : null}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            <FormField
                marginTop={24}
                label="Item Photo (optional)"
                description="Upload a photo of the item. Note we will only include
                a link to the photo rather than the photo itself in the email; the
                photo will be accessible on the internet."
                required
            />
            <FilePicker
                id="event-image"
                name="Picture of the Item"
                onChange={uploadImage}
                placeholder="Select image here!"
                required
                marginBottom={30}
            />
        </Pane>
    )
}

function SaleForm({
    name, setName,
    desc, setDesc,
    link, setLink,
}) {
    const [nameInvalid, setNameInvalid] = useState(false)
    const [descInvalid, setDescInvalid] = useState(false)
    const [filled, setFilled] = useState(false);
    const [filledDesc, setFilledDesc] = useState(false);

    const [accessoriesChecked, setAccessoriesChecked] = useState(false)
    const [beautyChecked, setBeautyChecked] = useState(false)
    const [clothingChecked, setClothingChecked] = useState(false)
    const [electronicsChecked, setElectronicsChecked] = useState(false)
    const [ticketChecked, setTicketChecked] = useState(false)
    const [foodChecked, setFoodChecked] = useState(false)
    const [furnitureChecked, setFurnitureChecked] = useState(false)
    const [schoolChecked, setSchoolChecked] = useState(false)
    const [textbookChecked, setTextbookChecked] = useState(false)
    const [otherChecked, setOtherChecked] = useState(false)

    useEffect(() => {
        if (name === '') setFilled(true);
        if (filled) setNameInvalid(name === '');
        if (desc === '') setFilledDesc(true);
        if (filledDesc) setDescInvalid(desc === '');
    }, [name, desc]);
    return (
        <Pane>
            <TextInputField
                label="Title"
                isInvalid={nameInvalid}
                required
                placeholder="Closet sale of jackets and some shoes!"
                description="For example: Closet sale of jackets and some shoes!"
                validationMessage={nameInvalid ? 'Must have an item name' : null}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextInputField
                label="Google Slides URL (optional)"
                placeholder="https://docs.google.com/presentation/d/1234"
                description="If your sale is on Google Slides,
                you may copy paste your URL here.
                Make sure it starts with https://docs.google.com/"
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <TextareaField
                label="Description of Item"
                isInvalid={descInvalid}
                required
                placeholder="Selling some old jackets and some shoes that I
                no longer use, many in great condition; prices negotiable.
                See the Google Slides link for more details."
                description="Brief details about the sale. (<200 characters)"
                validationMessage={descInvalid ? 'Must have a description' : null}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            <Text size={400}><Strong>Categories</Strong></Text>
            <Checkbox
                label="Accessories"
                checked={accessoriesChecked}
                onChange={(e) => setAccessoriesChecked(e.target.checked)}
            />
            <Checkbox
                label="Beauty Supplies"
                checked={beautyChecked}
                onChange={(e) => setBeautyChecked(e.target.checked)}
            />
            <Checkbox
                label="Clothing"
                checked={clothingChecked}
                onChange={(e) => setClothingChecked(e.target.checked)}
            />
            <Checkbox
                label="Electronics"
                checked={electronicsChecked}
                onChange={(e) => setElectronicsChecked(e.target.checked)}
            />
            <Checkbox
                label="Event Tickets"
                checked={ticketChecked}
                onChange={(e) => setTicketChecked(e.target.checked)}
            />
            <Checkbox
                label="Food"
                checked={foodChecked}
                onChange={(e) => setFoodChecked(e.target.checked)}
            />
            <Checkbox
                label="Furniture"
                checked={furnitureChecked}
                onChange={(e) => setFurnitureChecked(e.target.checked)}
            />
            <Checkbox
                label="School Supplies"
                checked={schoolChecked}
                onChange={(e) => setSchoolChecked(e.target.checked)}
            />
            <Checkbox
                label="Textbooks"
                checked={textbookChecked}
                onChange={(e) => setTextbookChecked(e.target.checked)}
            />
            <Checkbox
                label="Other"
                checked={otherChecked}
                onChange={(e) => setOtherChecked(e.target.checked)}
            />
        </Pane>
    )
}

function GenericForm({
    name, setName,
    desc, setDesc,
}) {
    const [nameInvalid, setNameInvalid] = useState(false)
    const [descInvalid, setDescInvalid] = useState(false)
    const [filled, setFilled] = useState(false);
    const [filledDesc, setFilledDesc] = useState(false);

    useEffect(() => {
        if (name === '') setFilled(true);
        if (filled) setNameInvalid(name === '');
        if (desc === '') setFilledDesc(true);
        if (filledDesc) setDescInvalid(desc === '');
    }, [name, desc]);
    return (
        <Pane>
            <TextInputField
                label="Title"
                isInvalid={nameInvalid}
                required
                description="Title of your message"
                validationMessage={nameInvalid ? 'Must have an item name' : null}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextareaField
                label="Message Content"
                isInvalid={descInvalid}
                required
                description="The content of your message. (<200 characters)"
                validationMessage={descInvalid ? 'Must have a description' : null}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
        </Pane>
    )
}

export {
    LostAndFoundForm,
    SaleForm,
    GenericForm,
}
