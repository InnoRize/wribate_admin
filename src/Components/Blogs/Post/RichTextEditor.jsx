import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ content, onChange, onWordCountChange }) => {
  const [value, setValue] = useState(content || '');

  // Custom image handler for base64 conversion
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const quill = this.quill;
        const range = quill.getSelection();
        const base64 = reader.result;
        
        // Insert image at cursor position
        quill.insertEmbed(range.index, 'image', base64);
      };
      reader.readAsDataURL(file);
    };
  };

  // Toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ];

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
    onChange(content);
    
    // Calculate word count
    const text = editor.getText();
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    onWordCountChange(wordCount);
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your content here..."
        style={{ 
          height: '300px',
          marginBottom: '50px' // Space for toolbar
        }}
      />
      
      <style jsx global>{`
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 10px 0;
        }
        
        .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;