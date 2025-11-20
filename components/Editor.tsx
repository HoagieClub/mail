import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

import Quill from 'quill';
import Toolbar from 'quill/modules/toolbar';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

// Disable Quill's default formatting for new lines
const SizeStyle = Quill.import('attributors/style/size') as any;
const FontStyle = Quill.import('attributors/style/font') as any;

SizeStyle.whitelist = null;
FontStyle.whitelist = null;

Quill.register(SizeStyle, true);
Quill.register(FontStyle, true);

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
            '72px',
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
            [{ header: [1, 2, 3, false] }],
            [{ size: fontSizeArr }], // custom dropdown
            [{ font: fonts }],

            ['link', 'image'],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript

            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme

            ['blockquote'],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],

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

            toolbar.addHandler('header', (value) => {
                const range = quill.getSelection();
                if (!range) return;

                // Apply the new header format
                quill.format('header', value);

                // Remove all inline font-size styles inside the header element
                const [line] = quill.getLine(range.index);
                if (line && line.domNode) {
                    // Get the root element (e.g., <h1>, <h2>)
                    const headerEl = line.domNode.closest('h1, h2, h3');
                    if (headerEl) {
                        // Select *all* descendants with inline font-size, no matter the tag
                        const elementsWithSize = headerEl.querySelectorAll(
                            '[style*="font-size"]'
                        );
                        elementsWithSize.forEach((el: HTMLElement) => {
                            el.style.removeProperty('font-size');
                        });
                    }
                }
            });

            quillRef.current = quill;

            /** Copy computed font-size from the first child with inline size into the li so ::before inherits it */
            function syncListItemFontSizes() {
                const editor = quill.root;
                const lis = editor.querySelectorAll('li');
                lis.forEach((li) => {
                    // find first descendant that contains an inline font-size style (Quill usually puts it on a span)
                    const childWithSize = li.querySelector(
                        '[style*="font-size"]'
                    );
                    if (childWithSize) {
                        const fs = window.getComputedStyle(
                            childWithSize as Element
                        ).fontSize;
                        // apply to the li so ::before inherits
                        (li as HTMLElement).style.fontSize = fs;
                    } else {
                        // no inline size found — clear explicit font-size to fall back to normal
                        (li as HTMLElement).style.removeProperty('font-size');
                    }
                });
            }

            // initial sync after setContents / HTML load
            setTimeout(syncListItemFontSizes, 0);

            // Keep in sync on user changes and selection change
            quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                if (source === 'user' || source === 'api') {
                    syncListItemFontSizes();
                }
            });

            quill.on(Quill.events.SELECTION_CHANGE, () => {
                syncListItemFontSizes();
            });

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

            // Apply last selected font to new text, AND carry it onto new lines
            quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                if (source !== 'user') return;

                let index = 0;

                delta.ops?.forEach((op) => {
                    if (typeof op.insert === 'string') {
                        const text = op.insert;

                        // If user pressed ENTER
                        if (text.includes('\n')) {
                            // Copy previous line's formatting
                            const prevFormats = quill.getFormat(index - 1);

                            quill.formatLine(
                                index, // position of newline
                                1,
                                {
                                    size:
                                        prevFormats.size ||
                                        lastFontSize.current,
                                    font: prevFormats.font || lastFont.current,
                                },
                                'silent'
                            );
                        } else {
                            // Normal characters - apply last selected format
                            quill.formatText(
                                index,
                                text.length,
                                {
                                    size: lastFontSize.current,
                                    font: lastFont.current,
                                },
                                'silent'
                            );
                        }

                        index += text.length;
                    } else if (typeof op.retain === 'number') {
                        index += op.retain;
                    }
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
                style={{ minHeight: '200px', marginBottom: '2rem' }}
            ></div>
        );
    }
);

Editor.displayName = 'Editor';

export default Editor;
