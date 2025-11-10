import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

import Quill from 'quill';
import Toolbar from 'quill/modules/toolbar';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

interface ImageResult {
    success: boolean;
    data: {
        link: string;
        error: string;
    };
}

interface RichTextEditorProps {
    onTextChange?: (...args: any[]) => void;
    onSelectionChange?: (...args: any[]) => void;
    onHTMLChange?: (html: string) => void;
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill, RichTextEditorProps>(
    ({ onTextChange, onSelectionChange, onHTMLChange }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);
        const lastFontSize = useRef<string | any>('14px'); // initial default
        const lastFont = useRef<string | any>('arial'); // default font family

        const quillRef = ref as React.MutableRefObject<Quill | null>;
        const fontSizeArr = [
            '10px',
            '12px',
            '14px',
            '16px',
            '18px',
            '20px',
            '24px',
            '28px',
            '32px',
            '40px',
            '48px',
            '56px',
            '64px',
            '80px',
            '96px',
        ];

        const fonts = [
            'arial',
            'helvetica',
            'times',
            'courier',
            'georgia',
            'verdana',
            'roboto',
            'open-sans',
            'lato',
            'montserrat',
        ];

        const Size = Quill.import('attributors/style/size') as any;
        const FontAttributor = Quill.import('attributors/style/font') as any;

        Size.whitelist = fontSizeArr;
        FontAttributor.whitelist = fonts;
        Quill.register(Size, true);
        Quill.register(FontAttributor, true);

        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote'],
            ['link', 'image'],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }],

            [{ size: fontSizeArr }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: fonts }],
            [{ align: [] }],

            ['clean'], // remove formatting button
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
                container.ownerDocument.createElement('div')
            );
            const quill = new Quill(editorContainer, {
                modules: {
                    toolbar: toolbarOptions,
                    imageResize: { modules: ['Resize', 'DisplaySize'] } as any,
                },
                theme: 'snow',
            });

            quill.format('size', '14px');
            quill.format('font', 'arial');

            // Intercept image uploads
            const toolbar = quill.getModule('toolbar') as Toolbar;

            toolbar.addHandler('image', () => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();

                input.onchange = async () => {
                    if (!input.files) return;
                    const file = input.files[0];
                    if (file) {
                        try {
                            const result = await saveToServer(file);
                            // Type narrowing
                            if (typeof result === 'string') {
                                // If result is a string, maybe use it directly
                                const range = quill.getSelection(true);
                                quill.insertEmbed(
                                    range!.index,
                                    'image',
                                    result
                                );
                                quill.setSelection(range!.index + 1);
                            } else if (
                                'result' in result &&
                                Array.isArray(result.result)
                            ) {
                                const range = quill.getSelection(true);
                                quill.insertEmbed(
                                    range!.index,
                                    'image',
                                    result.result[0].url
                                );
                                quill.setSelection(range!.index + 1);
                            }
                        } catch {
                            return false;
                        }
                    }
                };
            });

            quillRef.current = quill;

            /* Load saved editor content from localStorage
            Saved in both HTML and Delta formats for flexibility (HTML for reloading then sending form
            and Delta for reloading then still editing) */
            const savedDelta = localStorage.getItem('mailBodyDelta');
            if (savedDelta) {
                quill.setContents(JSON.parse(savedDelta));
            } else {
                const savedHTML = localStorage.getItem('mailBody');
                if (savedHTML) {
                    quill.root.innerHTML = JSON.parse(savedHTML);
                }
            }

            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onTextChangeRef.current?.(...args);
                onHTMLChange?.(quill.root.innerHTML);

                // Save content to localStorage on every change
                const html = quill.root.innerHTML;
                const delta = quill.getContents();
                localStorage.setItem('mailBody', JSON.stringify(html));
                localStorage.setItem('mailBodyDelta', JSON.stringify(delta));
                onHTMLChange?.(html);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            //   Ensures all links work without https://
            quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                if (source !== 'user') return;

                const editor = quill.root;
                const links = editor.querySelectorAll('a');

                links.forEach((link) => {
                    const href = link.getAttribute('href');
                    if (href && !/^https?:\/\//i.test(href)) {
                        link.setAttribute('href', 'https://' + href);
                    }
                });
            });

            // Update lastFontSize and lastFont whenever selection changes
            quill.on(Quill.events.SELECTION_CHANGE, (range) => {
                if (!range) return;

                const formats = quill.getFormat(range);
                if (formats.size) lastFontSize.current = formats.size;
                if (formats.font) lastFont.current = formats.font;
            });

            // Apply last selected font size and font family to newly typed text
            quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                if (source !== 'user') return;

                let index = 0;
                delta.ops?.forEach((op) => {
                    if (op.insert) {
                        const length =
                            typeof op.insert === 'string'
                                ? op.insert.length
                                : 1;

                        // Apply font size and font family
                        quill.formatText(
                            index,
                            length,
                            'size',
                            lastFontSize,
                            'silent'
                        );
                        quill.formatText(
                            index,
                            length,
                            'font',
                            lastFont,
                            'silent'
                        );

                        index += length;
                    } else if (op.retain) {
                        if (typeof op.retain === 'number') {
                            index += op.retain;
                        }
                    }
                    // op.delete is ignored
                });
            });

            return () => {
                quillRef.current = null;
                container.innerHTML = '';
            };
        }, [ref]);

        return (
            <div
                ref={containerRef}
                style={{ height: '200px', marginBottom: '8rem' }}
            ></div>
        );
    }
);

Editor.displayName = 'Editor';

export default Editor;
