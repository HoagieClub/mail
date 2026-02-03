'use client';

import React, {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    MutableRefObject,
} from 'react';

import { Button, TickIcon, EraserIcon } from 'evergreen-ui';
import { createRoot } from 'react-dom/client';
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

/**
 * Checks if a string is a valid email address
 */
const isEmailAddress = (str: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return emailRegex.test(str);
};

/**
 * Normalizes HTML to fix paragraph spacing for email clients
 * - Adds inline styles to <p> tags to control margin (set to 0)
 * - Replaces empty paragraphs with <br> tags for consistent spacing
 * - Converts Quill alignment classes (ql-align-*) to inline text-align styles
 */
const normalizeHTMLForEmail = (html: string): string => {
    if (!html || typeof document === 'undefined') {
        return html;
    }

    // Create a temporary DOM element to parse and manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Map Quill alignment classes to text-align values
    const alignmentMap: Record<string, string> = {
        'ql-align-left': 'left',
        'ql-align-center': 'center',
        'ql-align-right': 'right',
        'ql-align-justify': 'justify',
    };

    // Convert alignment classes to inline styles
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach((element) => {
        const classList = Array.from(element.classList);
        classList.forEach((className) => {
            if (className in alignmentMap) {
                (element as HTMLElement).style.textAlign =
                    alignmentMap[className];
                element.classList.remove(className);
            }
        });
    });

    // Process all paragraph tags
    const paragraphs = Array.from(tempDiv.querySelectorAll('p'));

    paragraphs.forEach((p) => {
        // Check if paragraph is empty or only contains <br>
        const innerHTML = p.innerHTML.trim();
        const isEmpty =
            innerHTML === '' || innerHTML === '<br>' || innerHTML === '<br/>';

        if (isEmpty) {
            // Replace empty paragraphs with a single <br> tag
            const br = document.createElement('br');
            if (p.parentNode) {
                p.parentNode.replaceChild(br, p);
            }
        } else {
            // Add inline styles to control margin for non-empty paragraphs
            // Set margins to 0 to prevent email clients from adding extra spacing
            p.style.marginTop = '0';
            p.style.marginBottom = '0';
        }
    });

    // Convert back to HTML string
    const normalizedHTML = tempDiv.innerHTML;

    return normalizedHTML;
};

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
    ['undo', 'redo'],

    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],

    ['blockquote'],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],

    [{ align: [] }],

    ['clean'],
    ['fullscreen'],
];

const Editor = forwardRef<any, RichTextEditorProps>(
    ({ onTextChange, onSelectionChange, onHTMLChange }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const quillRef = ref as MutableRefObject<any | null>;

        const initialized = useRef(false); // Prevents double Quill instance

        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);
        const onHTMLChangeRef = useRef(onHTMLChange);

        const lastFontSize = useRef<string>('14px');
        const lastFont = useRef<string>('arial');

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
            onHTMLChangeRef.current = onHTMLChange;
        });

        const saveToServer = async (file: File) => {
            // Uncomment below for local image testing (default Hoagie image)
            // return {
            //     result: [
            //         {
            //             url: 'https://i.imgur.com/p2jC53h.jpeg',
            //         },
            //     ],
            // };

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

            const container = containerRef.current;
            if (!container) return;

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
                const editorEl = container.appendChild(
                    container.ownerDocument.createElement('div')
                );

                quill = new Quill(editorEl, {
                    theme: 'snow',
                    placeholder:
                        'Compose your campus-wide announcement here — use the toolbar above to format your text.',
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                undo: function () {
                                    (this as any).quill.history.undo();
                                },
                                redo: function () {
                                    (this as any).quill.history.redo();
                                },
                                clean: function () {
                                    const quill = (this as any).quill;
                                    const range = quill.getSelection(true);
                                    if (range) {
                                        // Remove all formatting
                                        quill.removeFormat(range);
                                        // Set default font size
                                        quill.formatText(range.index, range.length, 'size', '14px');
                                        quill.formatText(range.index, range.length, 'font', 'arial');
                                    }
                                },
                                fullscreen: function () {
                                    // Handled by manual event listener below (needs to toggle icon and fullscreen state)
                                },
                            },
                        },
                        imageResize: { modules: ['Resize', 'DisplaySize'] },
                    },
                });

                quillRef.current = quill;

                // Set default formats
                quill.format('size', '14px');
                quill.format('font', 'arial');

                /** ----------------------------------------------
                 *  Update toolbar pickers to show active state on initial load
                 * ---------------------------------------------- */
                const toolbarModule = quill.getModule('toolbar');
                const updatePicker = (pickerClass: string, value: string) => {
                    const picker = toolbarModule.container.querySelector(pickerClass);
                    const label = picker?.querySelector('.ql-picker-label');
                    // Picker options may not be in DOM until first opened, so we need to trigger their creation
                    const pickerButton = picker?.querySelector('.ql-picker-label') as HTMLElement;
                    if (pickerButton && !picker?.querySelector('.ql-picker-options')) {
                        // Trigger picker to render options by simulating a click
                        pickerButton.click();
                        pickerButton.click(); // Click again to close it
                    }
                    
                    const options = picker?.querySelector('.ql-picker-options');
                    const option = options?.querySelector(`[data-value="${value}"]`) as HTMLElement;
                    
                    if (label && option) {
                        const labelSpan = label.querySelector('span');
                        if (labelSpan) labelSpan.textContent = option.textContent;
                        label.setAttribute('data-value', value);
                        options.querySelectorAll('.ql-picker-item').forEach((item: any) => {
                            item.classList.remove('ql-selected');
                        });
                        option.classList.add('ql-selected');
                    }
                };
                
                updatePicker('.ql-size', '14px');
                updatePicker('.ql-font', 'arial');

                /** ----------------------------------------------
                 *  Enhanced color picker with hex input and remove button
                 * ---------------------------------------------- */

                // React component for color picker enhancement
                const ColorPickerEnhancement = ({
                    quill,
                    formatName,
                    defaultValue,
                    colorPicker,
                }: {
                    quill: any;
                    formatName: string;
                    defaultValue: string;
                    colorPicker: HTMLElement;
                }) => {
                    const [hexValue, setHexValue] = React.useState('');
                    const [error, setError] = React.useState(false);

                    const applyHexColor = () => {
                        let hex = hexValue.trim();
                        if (!hex.startsWith('#')) {
                            hex = '#' + hex;
                        }
                        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                        if (hexRegex.test(hex)) {
                            quill.format(formatName, hex);
                            colorPicker.classList.remove('ql-expanded');
                            setHexValue('');
                            setError(false);
                        } else {
                            setError(true);
                            setTimeout(() => setError(false), 1000);
                        }
                    };

                    const removeColor = () => {
                        quill.format(formatName, defaultValue);
                        colorPicker.classList.remove('ql-expanded');
                    };

                    return (
                        <div className='ql-hex-input-container'>
                            <div className='ql-hex-input-wrapper'>
                                <input
                                    type='text'
                                    placeholder='#000000'
                                    className='ql-hex-input'
                                    maxLength={7}
                                    value={hexValue}
                                    onChange={(e) =>
                                        setHexValue(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            applyHexColor();
                                        }
                                    }}
                                    style={{
                                        borderColor: error ? '#ff0000' : '#ccc',
                                    }}
                                />
                                <div className='ql-icon-button-wrapper ql-apply-button'>
                                    <Button
                                        appearance='default'
                                        size='small'
                                        iconBefore={TickIcon}
                                        onClick={applyHexColor}
                                        title='Apply'
                                    />
                                </div>
                                <div className='ql-icon-button-wrapper ql-remove-button'>
                                    <Button
                                        appearance='default'
                                        size='small'
                                        iconBefore={EraserIcon}
                                        onClick={removeColor}
                                        title='Remove Format'
                                    />
                                </div>
                            </div>
                        </div>
                    );
                };

                const enhanceColorPicker = (
                    pickerClass: string,
                    formatName: string,
                    defaultValue: string
                ) => {
                    const toolbarEl = document.querySelector('.ql-toolbar');
                    const colorPicker = toolbarEl?.querySelector(
                        pickerClass
                    ) as HTMLElement;
                    if (!colorPicker) return;

                    const pickerOptions = colorPicker.querySelector(
                        '.ql-picker-options'
                    ) as HTMLElement;
                    if (!pickerOptions) return;

                    // Check if already enhanced
                    if (
                        pickerOptions.querySelector('.ql-hex-input-container')
                    ) {
                        return;
                    }

                    // Create container and render React component
                    const container = document.createElement('div');
                    const root = createRoot(container);
                    root.render(
                        React.createElement(ColorPickerEnhancement, {
                            quill,
                            formatName,
                            defaultValue,
                            colorPicker,
                        })
                    );
                    pickerOptions.appendChild(container);
                };

                // Enhance color pickers (toolbar is created synchronously with Quill)
                [
                    { class: '.ql-color', format: 'color', default: '#000000' },
                    {
                        class: '.ql-background',
                        format: 'background',
                        default: '',
                    },
                ].forEach(
                    ({ class: pickerClass, format, default: defaultValue }) => {
                        enhanceColorPicker(pickerClass, format, defaultValue);
                    }
                );

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

                            const imageUrl =
                                typeof result === 'string'
                                    ? result
                                    : result.result[0].url;

                            quill.insertEmbed(range.index, 'image', imageUrl);

                            // Set a default width on the inserted image. Only
                            // apply it when no explicit width has been set yet.
                            requestAnimationFrame(() => {
                                const images =
                                    quill.root.querySelectorAll('img');
                                for (const img of images) {
                                    if (
                                        img.src === imageUrl ||
                                        img.src.endsWith(imageUrl)
                                    ) {
                                        if (!img.hasAttribute('width')) {
                                            img.setAttribute('width', '500');
                                            img.removeAttribute('height');
                                        }
                                        break;
                                    }
                                }
                            });

                            quill.setSelection(range.index + 1);
                        } catch {}
                    };
                });

                // Add tooltips to toolbar buttons
                const toolbarElement = document.querySelector('.ql-toolbar');
                if (toolbarElement) {
                    // Map of button classes to tooltip text
                    const tooltipMap: Record<string, string> = {
                        '.ql-header': 'Heading',
                        '.ql-size': 'Font Size',
                        '.ql-font': 'Font Family',
                        '.ql-link': 'Link',
                        '.ql-image': 'Image',
                        '.ql-undo': 'Undo',
                        '.ql-redo': 'Redo',
                        '.ql-bold': 'Bold',
                        '.ql-italic': 'Italic',
                        '.ql-underline': 'Underline',
                        '.ql-strike': 'Strikethrough',
                        '.ql-color': 'Text Color',
                        '.ql-background': 'Background Color',
                        '.ql-blockquote': 'Quote',
                        '.ql-list[value="ordered"]': 'Numbered List',
                        '.ql-list[value="bullet"]': 'Bullet List',
                        '.ql-script[value="sub"]': 'Subscript',
                        '.ql-script[value="super"]': 'Superscript',
                        '.ql-align': 'Text Alignment',
                        '.ql-clean': 'Clear Formatting',
                        '.ql-fullscreen': 'Fullscreen',
                    };

                    // Add tooltips to all toolbar buttons
                    Object.entries(tooltipMap).forEach(
                        ([selector, tooltip]) => {
                            const button = toolbarElement.querySelector(
                                selector
                            ) as HTMLElement;
                            if (button) {
                                button.setAttribute('title', tooltip);
                            }
                        }
                    );

                    const fullscreenButton = document.querySelector(
                        '.ql-fullscreen'
                    ) as HTMLElement;

                    const undoButton = document.querySelector(
                        '.ql-undo'
                    ) as HTMLElement;

                    const redoButton = document.querySelector(
                        '.ql-redo'
                    ) as HTMLElement;

                    fullscreenButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24"><path d="M9.29,13.29,4,18.59V17a1,1,0,0,0-2,0v4a1,1,0,0,0,.08.38,1,1,0,0,0,.54.54A1,1,0,0,0,3,22H7a1,1,0,0,0,0-2H5.41l5.3-5.29a1,1,0,0,0-1.42-1.42ZM5.41,4H7A1,1,0,0,0,7,2H3a1,1,0,0,0-.38.08,1,1,0,0,0-.54.54A1,1,0,0,0,2,3V7A1,1,0,0,0,4,7V5.41l5.29,5.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM21,16a1,1,0,0,0-1,1v1.59l-5.29-5.3a1,1,0,0,0-1.42,1.42L18.59,20H17a1,1,0,0,0,0,2h4a1,1,0,0,0,.38-.08,1,1,0,0,0,.54-.54A1,1,0,0,0,22,21V17A1,1,0,0,0,21,16Zm.92-13.38a1,1,0,0,0-.54-.54A1,1,0,0,0,21,2H17a1,1,0,0,0,0,2h1.59l-5.3,5.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L20,5.41V7a1,1,0,0,0,2,0V3A1,1,0,0,0,21.92,2.62Z"/></svg>`;
                    undoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" font-weight="bold" viewBox="-0.5 0 25 25" width="15" height"15" fill="none">
<path d="M10 21.4199H15C16.8565 21.4199 18.637 20.6824 19.9497 19.3696C21.2625 18.0569 22 16.2764 22 14.4199C22 12.5634 21.2625 10.783 19.9497 9.47021C18.637 8.15746 16.8565 7.41992 15 7.41992H2" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 11.4199L2 7.41992L6 3.41992" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
                    redoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 25 25" width="15" height"15" fill="none">
<path d="M14 21.4199H9C7.14348 21.4199 5.36302 20.6824 4.05026 19.3696C2.73751 18.0569 2 16.2764 2 14.4199C2 12.5634 2.73751 10.783 4.05026 9.47021C5.36302 8.15746 7.14348 7.41992 9 7.41992H22" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 11.4199L22 7.41992L18 3.41992" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
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

                    // Undo/redo handlers are now registered in Quill config
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

                    // Normalize HTML for email clients to fix paragraph spacing
                    const normalizedHTML = normalizeHTMLForEmail(html);

                    localStorage.setItem('mailBody', JSON.stringify(html));
                    localStorage.setItem(
                        'mailBodyDelta',
                        JSON.stringify(delta)
                    );

                    onHTMLChangeRef.current?.(normalizedHTML);
                });

                /** ----------------------------------------------
                 *  Selection handler
                 * ---------------------------------------------- */
                quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                    onSelectionChangeRef.current?.(...args);
                });

                /** ----------------------------------------------
                 *  Ensure links always start with https://
                 *  (but preserve mailto: links and auto-detect email addresses)
                 * ---------------------------------------------- */
                quill.on(
                    Quill.events.TEXT_CHANGE,
                    (delta, oldDelta, source) => {
                        if (source !== 'user') return;

                        const links = quill.root.querySelectorAll('a');
                        links.forEach((link) => {
                            const href = link.getAttribute('href');
                            if (href && !/^https?:\/\//i.test(href)) {
                                if (/^mailto:/i.test(href)) {
                                    return;
                                }

                                // Check if it is an email address
                                if (isEmailAddress(href)) {
                                    link.setAttribute('href', 'mailto:' + href);
                                } else {
                                    link.setAttribute(
                                        'href',
                                        'https://' + href
                                    );
                                }
                            }
                        });
                    }
                );

                /** ----------------------------------------------
                 *  Preserve header format when size is changed via toolbar
                 * ---------------------------------------------- */
                // Override the format method to preserve header when size is changed
                const originalFormat = quill.format.bind(quill);
                quill.format = function (
                    name: string,
                    value: any,
                    source?: any
                ) {
                    // When header is being applied, remove any existing size format
                    // so CSS default can take effect
                    if (
                        name === 'header' &&
                        value !== false &&
                        value !== null
                    ) {
                        const range = quill.getSelection(true);
                        if (range) {
                            const currentFormat = quill.getFormat(range);
                            // Remove size format when header is applied so CSS default is used
                            if (currentFormat.size) {
                                quill.format('size', false, 'silent');
                            }
                        }
                    }

                    // When size is being changed, check if we need to preserve header
                    if (name === 'size' && value !== null && value !== false) {
                        const range = quill.getSelection(true);
                        if (range) {
                            const currentFormat = quill.getFormat(range);
                            const hadHeader = currentFormat.header;

                            // Update lastFontSize ref when size is changed
                            lastFontSize.current = value;

                            // Apply the size change
                            const result = originalFormat(name, value, source);

                            // If there was a header before, restore it after size change
                            if (hadHeader) {
                                setTimeout(() => {
                                    const newRange = quill.getSelection(true);
                                    if (newRange) {
                                        const newFormat =
                                            quill.getFormat(newRange);
                                        // Only restore if header was lost
                                        if (!newFormat.header) {
                                            quill.format(
                                                'header',
                                                hadHeader,
                                                'silent'
                                            );
                                        }
                                    }
                                }, 10);
                            }
                            return result;
                        }
                    }

                    // When font is being changed, update lastFont ref
                    if (name === 'font' && value !== null && value !== false) {
                        lastFont.current = value;
                    }

                    return originalFormat(name, value, source);
                };

                /** ----------------------------------------------
                 *  Maintain last font + size on new lines
                 * ---------------------------------------------- */
                quill.on(Quill.events.SELECTION_CHANGE, (range) => {
                    if (!range) return;

                    const f = quill.getFormat(range);

                    if (f.size) lastFontSize.current = f.size;
                    if (f.font) lastFont.current = f.font;
                });

                // Update last font/size when format is changed via toolbar
                quill.on(
                    Quill.events.TEXT_CHANGE,
                    (delta, oldDelta, source) => {
                        // When format is applied via toolbar (source === 'api'), update refs
                        if (source === 'api') {
                            const range = quill.getSelection(true);
                            if (range) {
                                const f = quill.getFormat(range);
                                if (f.size) lastFontSize.current = f.size;
                                if (f.font) lastFont.current = f.font;
                            }
                        }
                    }
                );

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

                                    const formatOptions: any = {
                                        font:
                                            prevFormats.font ||
                                            lastFont.current,
                                    };

                                    // Don't auto-apply size to headings - let CSS default handle it
                                    // Only apply size if not a heading (user can manually change it later)
                                    if (!prevFormats.header) {
                                        formatOptions.size =
                                            prevFormats.size ||
                                            lastFontSize.current;
                                    }

                                    quill.formatLine(
                                        index,
                                        1,
                                        formatOptions,
                                        'silent'
                                    );
                                } else {
                                    const currentFormats =
                                        quill.getFormat(index);

                                    const formatOptions: any = {
                                        font: lastFont.current,
                                    };

                                    // Don't auto-apply size to headings - let CSS default handle it
                                    // Only apply size if not a heading (user can manually change it later)
                                    if (!currentFormats.header) {
                                        formatOptions.size =
                                            lastFontSize.current;
                                    }

                                    quill.formatText(
                                        index,
                                        text.length,
                                        formatOptions,
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
                if (container) container.innerHTML = '';
            };
        }, [quillRef]);

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
