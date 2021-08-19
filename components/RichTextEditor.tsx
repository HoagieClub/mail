import { FormField, Pane } from 'evergreen-ui'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useEffect } from 'react';

interface ImageResult {
  success: boolean;
  data: {
    link: string;
    error: string;
  }
}

export default function RichTextEditor({ onChange, onError, label, required, description }) {
  const { quill, quillRef } = useQuill();

  // Insert Image(selected by user) to quill
  const insertToEditor = (url) => {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  };

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
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
      insertToEditor(imageResult.data.link); 
    } else {
      onError(`Hoagie Mail is having trouble uploading your image: ${imageResult.data.error}`);
    }
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
      quill.on('text-change', (delta, oldDelta, source) => {
        const plainText = quill.getText();
        const htmlContent = quillRef.current.firstChild.innerHTML;
        onChange({plainText, htmlContent});
      });

    }
  }, [quill]);

  return (
    <FormField
        label={label}
        isRequired={required}
        description={description}
        marginBottom='24px'
    > 
    <Pane width="100%">
      <div ref={quillRef} />
    </Pane>
    </FormField>
  );
};