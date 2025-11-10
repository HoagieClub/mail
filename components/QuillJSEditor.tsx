import './quilljs.css';
import React, { useRef, useState } from 'react';

import { FormField } from 'evergreen-ui';
import Quill from 'quill';

import Editor from './Editor';

const QuillJSEditor = ({ label, description, onHTMLChange }) => {
    const [, setRange] = useState();
    const [, setLastChange] = useState();

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
                    onSelectionChange={setRange}
                    onTextChange={setLastChange}
                    onHTMLChange={onHTMLChange}
                />
            </FormField>
        </div>
    );
};

export default QuillJSEditor;
