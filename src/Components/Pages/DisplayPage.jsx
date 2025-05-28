import { useEffect, useState } from "react"


export const DisplayPage = ({description})=>{
  const [html, setHtml] = useState("");
    

    useEffect(() =>{
        if (description) {
            setHtml(
                description
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
            );
        }
    }, [])
    if (!description) return null;

    return(
        <div dangerouslySetInnerHTML={{ __html: html }} />
    )
}