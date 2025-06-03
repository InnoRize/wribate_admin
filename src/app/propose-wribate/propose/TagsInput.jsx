import { X} from "lucide-react";
import React, { useState } from 'react';

const TagsInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e) => {
    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      
      // Check if tag already exists
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    } 
    // Remove last tag on Backspace if input is empty
    else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap w-full border-2 border-gray-200 rounded-none p-1 focus-within:border-blue-900 focus-within:ring-0 bg-white">
      {value.map((tag, index) => (
        <div 
          key={index} 
          className="flex items-center bg-blue-900 text-white rounded-none px-2 py-1 m-1 text-sm"
        >
          <span>{tag}</span>
          <button 
            type="button" 
            onClick={() => removeTag(tag)} 
            className="ml-1 text-white hover:text-blue-200 focus:outline-none"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow outline-none border-none p-2 min-w-[100px] bg-transparent"
        placeholder={value.length === 0 ? "Type tags and press Enter" : ""}
      />
    </div>
  );
};

export default TagsInput;