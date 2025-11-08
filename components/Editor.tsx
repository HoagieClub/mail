import Quill, { Delta } from 'quill';
import Toolbar from 'quill/modules/toolbar';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

interface ImageResult {
    success: boolean;
    data: {
        link: string;
        error: string;
    };
}

interface RichTextEditorProps {
    defaultValue: Delta | string;
    onTextChange?: (...args: any[]) => void;
    onSelectionChange?: (...args: any[]) => void;
    onHTMLChange?: (html: string) => void;
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill, RichTextEditorProps> (
  ({ defaultValue, onTextChange, onSelectionChange, onHTMLChange}, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const quillRef = ref as React.MutableRefObject<Quill | null>;
    const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
    ];

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
            console.log("image was successfully uploaded!")
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

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      const container = containerRef.current;
        if (container === null) return;
        if (ref === null) return;

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
            modules: {
            toolbar: toolbarOptions,
            imageResize: { modules: ['Resize', 'DisplaySize']} as any,
            },
            theme: 'snow',
        });


       // Intercept image uploads
        const toolbar = quill.getModule('toolbar') as Toolbar;

        // toolbar.addHandler('image', () => {
        //     const input = document.createElement('input');
        //     input.setAttribute('type', 'file');
        //     input.setAttribute('accept', 'image/*');
        //     input.click();

        //     input.onchange = async () => {
        //     if (!input.files) return;
        //     const file = input.files[0];
        //     if (file) {
        //         try {
        //         const result = await saveToServer(file);
        //         // Type narrowing
        //         if (typeof result === 'string') {
        //             // If result is a string, maybe use it directly
        //             const range = quill.getSelection(true);
        //             quill.insertEmbed(range!.index, 'image', result);
        //             quill.setSelection(range!.index + 1);
        //         } else if ('result' in result && Array.isArray(result.result)) {
        //             const range = quill.getSelection(true);
        //             quill.insertEmbed(range!.index, 'image', result.result[0].url);
        //             quill.setSelection(range!.index + 1);
        //         }
        //         } catch (err) {
        //         console.error('Image upload failed:', err);
        //         }
        //     }
        //     };
        // });

      quillRef.current = quill;

        if (defaultValueRef.current) {
        const content = defaultValueRef.current;

        if (typeof content === 'string') {
            // content is HTML
            quill.clipboard.dangerouslyPasteHTML(content);
        } else if ('ops' in content) {
            // content is a Quill Delta
            quill.setContents(content);
        }
        }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
        onHTMLChange?.(quill.root.innerHTML);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

    //   Ensures all links work without https://
      quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
        if (source !== 'user') return;

        const editor = quill.root;
        const links = editor.querySelectorAll('a');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !/^https?:\/\//i.test(href)) {
            link.setAttribute('href', 'https://' + href);
            }
        });
      });

      return () => {
        quillRef.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef} style={{ height: '200px', marginBottom: '8rem' }}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;