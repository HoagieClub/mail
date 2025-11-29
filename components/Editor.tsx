'use client';

import React, {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    MutableRefObject,
} from 'react';

import screenfull from 'screenfull';

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

const Editor = forwardRef<any, RichTextEditorProps>(
    ({ onTextChange, onSelectionChange, onHTMLChange }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const quillRef = ref as MutableRefObject<any | null>;

        const initialized = useRef(false); // Prevents double Quill instance

        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);

        const lastFontSize = useRef<string>('14px');
        const lastFont = useRef<string>('arial');

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

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

        const toolbarOptions = [
            [{ header: [1, 2, 3, false] }],
            [{ size: fontSizeArr }],
            [{ font: fonts }],

            ['link', 'image'],
            [{ script: 'sub' }, { script: 'super' }],

            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],

            ['blockquote'],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],

            [{ align: [] }],

            ['clean'],
            ['fullscreen'],
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

        useEffect(() => {
            if (initialized.current) return;
            initialized.current = true;

            if (!containerRef.current) return;

            let quill: any = null;

            (async () => {
                const Quill = (await import('quill')).default;
                const ImageResize = (
                    await import('quill-image-resize-module-react')
                ).default;

                /** ----------------------------------------------
                 *  Register image resize & override default whitelist
                 * ---------------------------------------------- */
                Quill.register('modules/imageResize', ImageResize);

                const SizeStyle = Quill.import('attributors/style/size') as any;
                const FontStyle = Quill.import('attributors/style/font') as any;

                // Disable Quill defaults
                SizeStyle.whitelist = null;
                FontStyle.whitelist = null;

                Quill.register(SizeStyle, true);
                Quill.register(FontStyle, true);

                // Add your custom whitelists
                const Size = Quill.import('attributors/style/size') as any;
                Size.whitelist = fontSizeArr;
                Quill.register(Size, true);

                const FontAttributor = Quill.import(
                    'attributors/style/font'
                ) as any;
                FontAttributor.whitelist = fonts;
                Quill.register(FontAttributor, true);

                /** ----------------------------------------------
                 *  Build the editor
                 * ---------------------------------------------- */
                const container = containerRef.current;
                if (!container) return;
                const editorEl = container.appendChild(
                    container.ownerDocument.createElement('div')
                );

                quill = new Quill(editorEl, {
                    theme: 'snow',
                    placeholder: 'Hello there!',
                    modules: {
                        toolbar: toolbarOptions,
                        imageResize: { modules: ['Resize', 'DisplaySize'] },
                    },
                });

                quillRef.current = quill;

                quill.format('size', '14px');
                quill.format('font', 'arial');

                /** ----------------------------------------------
                 *  Image upload handler
                 * ---------------------------------------------- */
                const toolbar = quill.getModule('toolbar');

                toolbar.addHandler('image', () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.click();

                    input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;

                        try {
                            const result = await saveToServer(file);
                            const range = quill.getSelection(true);

                            if (typeof result === 'string') {
                                quill.insertEmbed(range.index, 'image', result);
                            } else {
                                quill.insertEmbed(
                                    range.index,
                                    'image',
                                    result.result[0].url
                                );
                            }
                            quill.setSelection(range.index + 1);
                        } catch {}
                    };
                });

                // Add the fullscreen button to the toolbar
                const toolbarElement = document.querySelector('.ql-toolbar');
                if (toolbarElement) {
                    const fullscreenButton = document.querySelector(
                        '.ql-fullscreen'
                    ) as HTMLElement;
                    fullscreenButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24"><path d="M9.29,13.29,4,18.59V17a1,1,0,0,0-2,0v4a1,1,0,0,0,.08.38,1,1,0,0,0,.54.54A1,1,0,0,0,3,22H7a1,1,0,0,0,0-2H5.41l5.3-5.29a1,1,0,0,0-1.42-1.42ZM5.41,4H7A1,1,0,0,0,7,2H3a1,1,0,0,0-.38.08,1,1,0,0,0-.54.54A1,1,0,0,0,2,3V7A1,1,0,0,0,4,7V5.41l5.29,5.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM21,16a1,1,0,0,0-1,1v1.59l-5.29-5.3a1,1,0,0,0-1.42,1.42L18.59,20H17a1,1,0,0,0,0,2h4a1,1,0,0,0,.38-.08,1,1,0,0,0,.54-.54A1,1,0,0,0,22,21V17A1,1,0,0,0,21,16Zm.92-13.38a1,1,0,0,0-.54-.54A1,1,0,0,0,21,2H17a1,1,0,0,0,0,2h1.59l-5.3,5.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L20,5.41V7a1,1,0,0,0,2,0V3A1,1,0,0,0,21.92,2.62Z"/></svg>`;

                    // Add event listener to fullscreen button
                    fullscreenButton.addEventListener('click', () => {
                        const editor = containerRef.current as any;
                        if (screenfull.isFullscreen) {
                            fullscreenButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24"><path d="M9.29,13.29,4,18.59V17a1,1,0,0,0-2,0v4a1,1,0,0,0,.08.38,1,1,0,0,0,.54.54A1,1,0,0,0,3,22H7a1,1,0,0,0,0-2H5.41l5.3-5.29a1,1,0,0,0-1.42-1.42ZM5.41,4H7A1,1,0,0,0,7,2H3a1,1,0,0,0-.38.08,1,1,0,0,0-.54.54A1,1,0,0,0,2,3V7A1,1,0,0,0,4,7V5.41l5.29,5.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM21,16a1,1,0,0,0-1,1v1.59l-5.29-5.3a1,1,0,0,0-1.42,1.42L18.59,20H17a1,1,0,0,0,0,2h4a1,1,0,0,0,.38-.08,1,1,0,0,0,.54-.54A1,1,0,0,0,22,21V17A1,1,0,0,0,21,16Zm.92-13.38a1,1,0,0,0-.54-.54A1,1,0,0,0,21,2H17a1,1,0,0,0,0,2h1.59l-5.3,5.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L20,5.41V7a1,1,0,0,0,2,0V3A1,1,0,0,0,21.92,2.62Z"/></svg>`;

                            screenfull.toggle(editor);
                        } else {
                            fullscreenButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L8 6.58579V5C8 4.44772 8.44772 4 9 4C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9C4 8.44772 4.44772 8 5 8H6.58579L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289ZM19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L17.4142 8H19C19.5523 8 20 8.44772 20 9C20 9.55228 19.5523 10 19 10H15C14.4477 10 14 9.55228 14 9V5C14 4.44772 14.4477 4 15 4C15.5523 4 16 4.44772 16 5V6.58579L19.2929 3.29289ZM4 15C4 14.4477 4.44772 14 5 14H9C9.55228 14 10 14.4477 10 15V19C10 19.5523 9.55228 20 9 20C8.44772 20 8 19.5523 8 19V17.4142L4.70711 20.7071C4.31658 21.0976 3.68342 21.0976 3.29289 20.7071C2.90237 20.3166 2.90237 19.6834 3.29289 19.2929L6.58579 16H5C4.44772 16 4 15.5523 4 15ZM14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15C20 15.5523 19.5523 16 19 16H17.4142L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L16 17.4142V19C16 19.5523 15.5523 20 15 20C14.4477 20 14 19.5523 14 19V15Z" fill="#000000"/>
                            </svg>`;
                            screenfull.toggle(editor); 
                        }
                    });
                }

                /** ----------------------------------------------
                 *  Sync <li> font sizes (for bullet indentation)
                 * ---------------------------------------------- */
                function syncListItemFontSizes() {
                    const lis = quill.root.querySelectorAll('li');

                    lis.forEach((li) => {
                        const child = li.querySelector('[style*="font-size"]');

                        if (child) {
                            li.style.fontSize =
                                window.getComputedStyle(child).fontSize;
                        } else {
                            li.style.removeProperty('font-size');
                        }
                    });
                }

                setTimeout(syncListItemFontSizes, 0);

                quill.on(
                    Quill.events.TEXT_CHANGE,
                    (delta, oldDelta, source) => {
                        if (source === 'user' || source === 'api') {
                            syncListItemFontSizes();
                        }
                    }
                );

                quill.on(Quill.events.SELECTION_CHANGE, () => {
                    syncListItemFontSizes();
                });

                /** ----------------------------------------------
                 *  Restore saved content
                 * ---------------------------------------------- */
                const savedDelta = localStorage.getItem('mailBodyDelta');
                if (savedDelta) {
                    quill.setContents(JSON.parse(savedDelta));
                } else {
                    const savedHTML = localStorage.getItem('mailBody');
                    if (savedHTML) quill.root.innerHTML = JSON.parse(savedHTML);
                }

                /** ----------------------------------------------
                 *  Text change handler
                 * ---------------------------------------------- */
                quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                    onTextChangeRef.current?.(...args);

                    const html = quill.root.innerHTML;
                    const delta = quill.getContents();

                    localStorage.setItem('mailBody', JSON.stringify(html));
                    localStorage.setItem(
                        'mailBodyDelta',
                        JSON.stringify(delta)
                    );

                    onHTMLChange?.(html);
                });

                /** ----------------------------------------------
                 *  Selection handler
                 * ---------------------------------------------- */
                quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                    onSelectionChangeRef.current?.(...args);
                });

                /** ----------------------------------------------
                 *  Ensure links always start with https://
                 * ---------------------------------------------- */
                quill.on(
                    Quill.events.TEXT_CHANGE,
                    (delta, oldDelta, source) => {
                        if (source !== 'user') return;

                        const links = quill.root.querySelectorAll('a');
                        links.forEach((link) => {
                            const href = link.getAttribute('href');
                            if (href && !/^https?:\/\//i.test(href)) {
                                link.setAttribute('href', 'https://' + href);
                            }
                        });
                    }
                );

                /** ----------------------------------------------
                 *  Maintain last font + size on new lines
                 * ---------------------------------------------- */
                quill.on(Quill.events.SELECTION_CHANGE, (range) => {
                    if (!range) return;

                    const f = quill.getFormat(range);

                    if (f.size) lastFontSize.current = f.size;
                    if (f.font) lastFont.current = f.font;
                });

                quill.on(
                    Quill.events.TEXT_CHANGE,
                    (delta, oldDelta, source) => {
                        if (source !== 'user') return;

                        let index = 0;

                        delta.ops?.forEach((op) => {
                            if (typeof op.insert === 'string') {
                                const text = op.insert;

                                if (text.includes('\n')) {
                                    const prevFormats = quill.getFormat(
                                        index - 1
                                    );

                                    quill.formatLine(
                                        index,
                                        1,
                                        {
                                            size:
                                                prevFormats.size ||
                                                lastFontSize.current,
                                            font:
                                                prevFormats.font ||
                                                lastFont.current,
                                        },
                                        'silent'
                                    );
                                } else {
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
                    }
                );
            })();

            return () => {
                quillRef.current = null;
                if (containerRef.current) containerRef.current.innerHTML = '';
            };
        }, []);

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
