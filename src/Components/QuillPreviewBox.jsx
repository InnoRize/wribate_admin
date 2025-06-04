import DOMPurify from 'dompurify';
import { useEffect, useState } from "react"

const QuillPreviewBox = ({ value }) => {
    const [html, setHtml] = useState("");
        
    useEffect(() =>{
        if (value) {
            setHtml(
                DOMPurify.sanitize(
                value
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                )
            );
        }
    }, [])
    if (!value) return null;

  return (
    <div className="relative max-h-24 overflow-hidden text-sm text-gray-600 mb-3">
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default QuillPreviewBox;
