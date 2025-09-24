import { FormField } from 'evergreen-ui';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { ButtonListItem, SunEditorOptions } from 'suneditor/src/options';

const SunEditor = dynamic(() => import('suneditor-react'), {
    ssr: false,
});

interface ImageResult {
    success: boolean;
    data: {
        link: string;
        error: string;
    };
}

interface RichTextEditorProps {
    onError: (error: string) => void;
    onChange: (content: string) => void;
    label: string;
    placeholder?: string;
    description?: string;
    getEditor?: (sunEditor: SunEditorCore) => void;
    required?: boolean;
    isDisabled?: boolean;
}

export default function RichTextEditor({
    onError,
    onChange,
    label,
    placeholder,
    description,
    getEditor,
    required = false,
    isDisabled = false,
}: RichTextEditorProps) {
    // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
    const saveToServer = async (file: File) => {
        const body = new FormData();
        body.append('image', file);
        const res = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_API_ID}`,
            },
            body,
        });
        const image: ImageResult = await res.json();
        if (image.success) {
            return {
                result: [
                    {
                        url: image.data.link,
                        name: file.name,
                        size: file.size,
                    },
                ],
            };
        }
        return `Hoagie Mail is having trouble uploading your image: ${image.data.error}`;
    };

    const onImageUploadBefore = (files, uploadHandler) => {
        saveToServer(files[0]).then((res) => {
            uploadHandler(res);
        });
        return undefined;
    };
    const onImageUploadError = (errorMessage) => {
        onError(errorMessage);
        return false;
    };

    const buttonList: ButtonListItem[] = [
        ['undo', 'redo'],
        ['font', 'fontSize'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor'], // 'textStyle'
        ['outdent', 'indent'],
        ['align', 'list', 'lineHeight'],
        ['link', 'image', 'video'],
        ['fullScreen'],
    ];
    const options: SunEditorOptions = {
        buttonList,
        imageWidth: '500px',
        showPathLabel: false,
        height: 'auto',
        font: ['sans-serif', 'serif'],
        defaultStyle: 'font-family:sans-serif',
    };

    return (
        <FormField
            label={label}
            required={required}
            description={description}
            marginBottom='24px'
        >
            <SunEditor
                setOptions={options}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={false}
                disable={isDisabled}
                onImageUploadBefore={onImageUploadBefore}
                onImageUploadError={onImageUploadError}
                getSunEditorInstance={getEditor}
            />
        </FormField>
    );
}
