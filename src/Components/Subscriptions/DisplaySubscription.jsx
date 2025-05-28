import { useEffect, useState } from "react"


export const DisplaySubscription = ({description, cost})=>{
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
        if(document.getElementById("displayCost")){
            document.getElementById("displayCost").textContent = cost;
        }
    }, [])
    if (!description) return null;

    return(
        <div dangerouslySetInnerHTML={{ __html: html }} />
    )
}