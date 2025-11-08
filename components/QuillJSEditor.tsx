import './quilljs.css'
import React, { useRef, useState } from 'react';
import Editor from './Editor';
import Quill from 'quill';
import { FormField } from 'evergreen-ui';

const Delta = Quill.import('delta');

const QuillJSEditor = ( {label, description, onHTMLChange} ) => {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();

  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill | null>(null);

  return (
    <div>
        {/* Fix the labels --> make it like richsuneditor */}
       <FormField
                   label={label}
                   description={description}
                   marginBottom='24px'
               >
                  <Editor
                 
        ref={quillRef}
        defaultValue={new Delta()
          .insert('Hello')
          .insert('\n', { header: 1 })
          .insert('Some ')
          .insert('initial', { bold: true })
          .insert(' ')
          .insert('content', { underline: true })
          .insert('\n')}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
        onHTMLChange={onHTMLChange}
      />
          </FormField>
    </div> 
  );
};

export default QuillJSEditor;