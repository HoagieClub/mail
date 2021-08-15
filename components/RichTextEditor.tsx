import { useState, useRef } from 'react'
import { Pane, majorScale, FormField, PropertiesIcon } from 'evergreen-ui'
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function RichTextEditor(props) {


  const options = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize'], // 'formatBlock'
      // ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor'], // 'textStyle'
      // ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'list', 'lineHeight'], // 'horizontalRule'
      ['link', 'image', 'video'], // You must add the 'katex' library at options to use the 'math' plugin.
      ['fullScreen'], // 'codeview' 'showBlocks'
      ['preview'],
      // ['save', 'template'],
      // '/', Line break
    ],
    showPathLabel: false,
    resizingBar: false,
    // colorList: [
    //   ['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown']
    // ]
  };

  // const editor = useRef();

  // const getSunEditorInstance = (sunEditor) => {
  //     editor.current = sunEditor;
  // };
  

  return (
    <FormField
        label={props.label}
        isRequired={props.required}
        description={props.description}
        marginBottom='24px'
        > 
        <SunEditor 
        setOptions={options} 
        onChange={props.onChange}
        placeholder={props.placeholder}
        autoFocus={false} 
        disable={props.disable}
        />    
    </FormField>
  );
}
