import { FormField, Pane, Text, Alert } from 'evergreen-ui'
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css';
import SetOptions from "suneditor-react/src/types/SetOptions";
import { ButtonListItem } from "suneditor/src/options"

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface ImageResult {
    success: boolean;
    data: {
      link: string;
      error: string;
    }
}  

export default function RichTextEditor({
    onError,
    onChange,
    label,
    placeholder,
    description,
    getEditor = (editor) => {},
    required = false,
    isDisabled = false,
    }) {
    const onImageUploadBefore = (files, info, uploadHandler) => {
        console.log(info, uploadHandler);
        saveToServer(files[0]).then((res) => 
        {
            uploadHandler(res)
        })
        return undefined;
    }
    const onImageUploadError = (errorMessage, result) => {
        onError(errorMessage)
        return false;
    }

   // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file:File) => {
    const body = new FormData();
    body.append('image', file);
    const res = await fetch('https://api.imgur.com/3/image', {
          method: "POST",
          headers: {
            Authorization: 'Client-ID ' + process.env.NEXT_PUBLIC_IMGUR_API_ID,
          },
          body,
    });
    const imageResult:ImageResult = await res.json();
    if (imageResult.success) {
        return {
            result: [{
            url: imageResult.data.link,
            name: file.name,
            size: file.size,
            }]
        }
    } else {
        return `Hoagie Mail is having trouble uploading your image: ${imageResult.data.error}`
    }
  }; 

  const buttonList:ButtonListItem[] = [
    ['undo', 'redo'],
    ['font', 'fontSize'], 
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor'], // 'textStyle'
    ['outdent', 'indent'],
    ['align', 'list', 'lineHeight'],
    ['link', 'image', 'video'],
    ['fullScreen'],
    ['preview'],
  ]
  const options:SetOptions = {
    buttonList,
    imageWidth: '500px',
    showPathLabel: false,
    height : 'auto',
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
        <Alert
          marginBottom="20px"
        >
          <b>Guide to Email Formatting:</b>
          <div className="small-text">
            To make sure your email formattng does not get messed up:
            <ol>
              <li><b>Do not copy-paste images</b> and minimize copy-pasting text. Copy-pasted images are unlikely to appear in the actual email.</li>
              <li><b>Resize images to be at most 600px width</b> and check the Preview before submitting. That being said, the preview can be misleading with regards to scale and images shown.
              <br/><br />We recommend making posters around 400px to 600px in width and logos 100px to 200px.</li>
            </ol>
            We are working on ways to make this more seamless, thank you for bearing with us in the meantime.
          </div>
        </Alert>
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
