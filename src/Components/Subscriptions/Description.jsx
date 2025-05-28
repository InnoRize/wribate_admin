// components/Description.js
import { Editor, EditorProvider,
  Toolbar, BtnBold, BtnItalic, BtnUnderline,
  BtnStrikeThrough, BtnNumberedList, BtnBulletList,
  BtnLink, BtnClearFormatting, BtnStyles,
  BtnUndo, BtnRedo, Separator, HtmlButton,
} from "react-simple-wysiwyg";
import { useEffect, useState } from "react";

export const Description = ({ description, setDescription, disableEdit = false }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (description) {
      setHtml(
        description
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
      );
    } else {
      setHtml("");
    }
  }, [description]);

  const handleChange = (e) => {
    setHtml(e.target.value);
    if(setDescription){
        setDescription(e.target.value);
    }
  };

  return (
    <EditorProvider>
      <Editor value={html} onChange={handleChange} disabled={disableEdit} className="bg-white border rounded p-2 max-h-[80vh] overflow-y-auto">
        <Toolbar>
          <BtnUndo />
          <BtnRedo />
          <Separator />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
          <BtnLink />
          <BtnClearFormatting />
          <HtmlButton />
          <Separator />
          <BtnStyles />
        </Toolbar>
      </Editor>
    </EditorProvider>
  );
};
