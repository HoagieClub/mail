"use client";

import React, {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    MutableRefObject,
} from "react";

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

        const initialized = useRef(false); // 🔥 Prevents double Quill instance

        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);

        const lastFontSize = useRef<string>("14px");
        const lastFont = useRef<string>("arial");

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        const fontSizeArr = [
            "10px",
            "12px",
            "14px",
            "16px",
            "18px",
            "20px",
            "24px",
            "28px",
            "32px",
            "40px",
            "48px",
            "56px",
            "64px",
            "72px",
        ];

        const fonts = [
            "arial",
            "helvetica",
            "times",
            "courier",
            "georgia",
            "verdana",
            "roboto",
            "open-sans",
            "lato",
            "montserrat",
        ];

        const toolbarOptions = [
            [{ header: [1, 2, 3, false] }],
            [{ size: fontSizeArr }],
            [{ font: fonts }],

            ["link", "image"],
            [{ script: "sub" }, { script: "super" }],

            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],

            ["blockquote"],

            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],

            [{ align: [] }],

            ["clean"],
        ];

        const saveToServer = async (file: File) => {
            const body = new FormData();
            body.append("image", file);

            const res = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
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
                const Quill = (await import("quill")).default;
                const ImageResize = (await import("quill-image-resize-module-react")).default;

                /** ----------------------------------------------
                 *  Register image resize & override default whitelist
                 * ---------------------------------------------- */
                Quill.register("modules/imageResize", ImageResize);

                const SizeStyle = Quill.import("attributors/style/size") as any;
                const FontStyle = Quill.import("attributors/style/font") as any;

                // Disable Quill defaults
                SizeStyle.whitelist = null;
                FontStyle.whitelist = null;

                Quill.register(SizeStyle, true);
                Quill.register(FontStyle, true);

                // Add your custom whitelists
                const Size = Quill.import("attributors/style/size") as any;
                Size.whitelist = fontSizeArr;
                Quill.register(Size, true);

                const FontAttributor = Quill.import("attributors/style/font") as any;
                FontAttributor.whitelist = fonts;
                Quill.register(FontAttributor, true);

                /** ----------------------------------------------
                 *  Build the editor
                 * ---------------------------------------------- */
                const container = containerRef.current;
                if (!container) return;
                const editorEl = container.appendChild(
                    container.ownerDocument.createElement("div")
                );

                quill = new Quill(editorEl, {
                    theme: "snow",
                    modules: {
                        toolbar: toolbarOptions,
                        imageResize: { modules: ["Resize", "DisplaySize"] },
                    },
                });

                quillRef.current = quill;

                quill.format("size", "14px");
                quill.format("font", "arial");

                /** ----------------------------------------------
                 *  Image upload handler
                 * ---------------------------------------------- */
                const toolbar = quill.getModule("toolbar");

                toolbar.addHandler("image", () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.click();

                    input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;

                        try {
                            const result = await saveToServer(file);
                            const range = quill.getSelection(true);

                            if (typeof result === "string") {
                                quill.insertEmbed(range.index, "image", result);
                            } else {
                                quill.insertEmbed(
                                    range.index,
                                    "image",
                                    result.result[0].url
                                );
                            }
                            quill.setSelection(range.index + 1);
                        } catch {}
                    };
                });

                /** ----------------------------------------------
                 *  Sync <li> font sizes (for bullet indentation)
                 * ---------------------------------------------- */
                function syncListItemFontSizes() {
                    const lis = quill.root.querySelectorAll("li");

                    lis.forEach((li) => {
                        const child = li.querySelector('[style*="font-size"]');

                        if (child) {
                            li.style.fontSize = window.getComputedStyle(child).fontSize;
                        } else {
                            li.style.removeProperty("font-size");
                        }
                    });
                }

                setTimeout(syncListItemFontSizes, 0);

                quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                    if (source === "user" || source === "api") {
                        syncListItemFontSizes();
                    }
                });

                quill.on(Quill.events.SELECTION_CHANGE, () => {
                    syncListItemFontSizes();
                });

                /** ----------------------------------------------
                 *  Restore saved content
                 * ---------------------------------------------- */
                const savedDelta = localStorage.getItem("mailBodyDelta");
                if (savedDelta) {
                    quill.setContents(JSON.parse(savedDelta));
                } else {
                    const savedHTML = localStorage.getItem("mailBody");
                    if (savedHTML) quill.root.innerHTML = JSON.parse(savedHTML);
                }

                /** ----------------------------------------------
                 *  Text change handler
                 * ---------------------------------------------- */
                quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                    onTextChangeRef.current?.(...args);

                    const html = quill.root.innerHTML;
                    const delta = quill.getContents();

                    localStorage.setItem("mailBody", JSON.stringify(html));
                    localStorage.setItem("mailBodyDelta", JSON.stringify(delta));

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
                quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                    if (source !== "user") return;

                    const links = quill.root.querySelectorAll("a");
                    links.forEach((link) => {
                        const href = link.getAttribute("href");
                        if (href && !/^https?:\/\//i.test(href)) {
                            link.setAttribute("href", "https://" + href);
                        }
                    });
                });

                /** ----------------------------------------------
                 *  Maintain last font + size on new lines
                 * ---------------------------------------------- */
                quill.on(Quill.events.SELECTION_CHANGE, (range) => {
                    if (!range) return;

                    const f = quill.getFormat(range);

                    if (f.size) lastFontSize.current = f.size;
                    if (f.font) lastFont.current = f.font;
                });

                quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
                    if (source !== "user") return;

                    let index = 0;

                    delta.ops?.forEach((op) => {
                        if (typeof op.insert === "string") {
                            const text = op.insert;

                            if (text.includes("\n")) {
                                const prevFormats = quill.getFormat(index - 1);

                                quill.formatLine(
                                    index,
                                    1,
                                    {
                                        size: prevFormats.size || lastFontSize.current,
                                        font: prevFormats.font || lastFont.current,
                                    },
                                    "silent"
                                );
                            } else {
                                quill.formatText(
                                    index,
                                    text.length,
                                    {
                                        size: lastFontSize.current,
                                        font: lastFont.current,
                                    },
                                    "silent"
                                );
                            }

                            index += text.length;
                        } else if (typeof op.retain === "number") {
                            index += op.retain;
                        }
                    });
                });
            })();

            return () => {
                quillRef.current = null;
                if (containerRef.current) containerRef.current.innerHTML = "";
            };
        }, []);

        return (
            <div
                ref={containerRef}
                style={{ minHeight: "200px", marginBottom: "2rem" }}
            ></div>
        );
    }
);

Editor.displayName = "Editor";

export default Editor;
