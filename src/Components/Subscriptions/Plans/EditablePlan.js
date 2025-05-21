import React, { useState, useEffect } from "react";
import { Editor, EditorProvider,
  Toolbar, BtnBold, BtnItalic, BtnUnderline,
  BtnStrikeThrough, BtnNumberedList, BtnBulletList,
  BtnLink, BtnClearFormatting, BtnStyles,
  BtnUndo, BtnRedo, Separator, HtmlButton,
} from "react-simple-wysiwyg";
import {Button} from "../../ui/button";
import { useUpdateHtmlContentMutation, useGetHtmlContentQuery } from "../../../app/services/authApi";
import axios from "axios";
import Swal from "sweetalert2";

export const EditablePlan = ({term}) => {
  const type = "subscription";
  const [html, setHtml] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [htmlID, setHtmlID] = useState(null);

  const [updateHtmlContent, {isLoading: isUpdating}] = useUpdateHtmlContentMutation();
  const { data: htmlContentData, isLoading, error, refetch } = useGetHtmlContentQuery({ type, name: term?.toLowerCase() });

  const handleChange = (e) => {
    console.log(e.target.value);
    setHtml(e.target.value);
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const saveContent = () => {
    // console.log("HTML", html);
    // console.log(typeof(html))
    try {
      const data = {
        type: type,
        name: term?.toLowerCase(),
        html: html,
      };

      updateHtmlContent({id: htmlID, data}).unwrap()
        .then((res) => {
          if (res.status === 1) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Content saved successfully!',
            });
            refetch();
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save content.',
            });
          }
        })
        .catch((error) => {
          console.error("Error saving content:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to save content.',
          });
        });
    } catch (error) {
      console.error("Error saving content:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save content.',
      });
    }
  };

  useEffect(() => {
    if (htmlContentData && htmlContentData.htmlContent) {
      setHtml(htmlContentData.htmlContent?.html?.
        replace(/&lt;/g, '<').
        replace(/&lt;/g, '<').
        replace(/&gt;/g, '>').
        replace(/&amp;/g, '&').
        replace(/&quot;/g, '"').
        replace(/&#39;/g, "'"));
      setHtmlID(htmlContentData.htmlContent._id);
      console.log(htmlContentData.htmlContent?.html?.replace('&lt;', '<'))
    }
    else {
      setHtml('');
      setHtmlID(null);
    }
  }, [htmlContentData]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Plan: {term}</h1>
        <div className="flex items-center h-12">
          <span className={`mr-3 ${isEditing ? "font-bold text-blue-900" : "text-gray-500"}`}>
            Edit
          </span>
          <div
            className={`w-10 h-6 flex items-center rounded-none p-1 cursor-pointer ${isEditing ? "bg-blue-900" : "bg-gray-300"}`}
            onClick={toggleEditing}
          >
            <div
              className={`bg-white h-4 w-4 shadow-md transform transition-transform ${isEditing ? "translate-x-3" : ""}`}
            ></div>
          </div>    
        </div>
      </div>
      
      <EditorProvider className="">
        <Editor value={html} onChange={handleChange} disabled={!isEditing} 
        className="bg-white w-full">
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

      <div className="flex justify-between mt-4">
        <Button onClick={saveContent}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
          Save
        </Button>
      </div>
    </div>
  );
};
