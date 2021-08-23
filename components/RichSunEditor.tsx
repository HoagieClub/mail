import { useState, useRef } from 'react'
import { Pane, majorScale, FormField, PropertiesIcon } from 'evergreen-ui'
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css';
import SetOptions from "suneditor-react/src/types/SetOptions";

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

  // const modules = {
  //   toolbar: [
  //     [{size: [ 'small', false, 'large', 'huge' ]}, {font: ['sans-serif', 
  //   'serif']}],
  //     ['bold', 'italic', 'underline','strike'],
  //     [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  //     ['link', 'image', 'video'],
  //     ['clean']
  //   ],
  // };

  const options:SetOptions = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize'], 
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor'], // 'textStyle'
      ['outdent', 'indent'],
      ['align', 'list', 'lineHeight'],
      ['link', 'image', 'video'],
      ['fullScreen'],
      ['preview'],
    ],
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
