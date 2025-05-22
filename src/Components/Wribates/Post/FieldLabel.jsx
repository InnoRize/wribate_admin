import { Info } from "lucide-react";
import { useState } from "react";

// Tooltip content for each field
const tooltips = {
    title: "The main topic or question for debate. Be clear and concise.",
    coverImage: "An image to represent your debate topic. Ideal size is 1200×630px.",
    leadFor: "The primary advocate for the proposition/affirmative side.",
    leadAgainst: "The primary advocate for the opposition/negative side.",
    supportingFor: "Additional participant supporting the affirmative side.",
    supportingAgainst: "Additional participant supporting the negative side.",
    judges: "Impartial evaluators who will determine the outcome of the debate.",
    startDate: "When the debate will begin. All participants should be available.",
    durationDays: "How many days the debate will last. Longer debates allow for more in-depth arguments.",
    category: "The subject area your debate falls under.",
    context: "Additional background information to help participants understand the debate's scope and purpose.",
    institution: "Organization or school hosting/associated with this debate.",
    scope: "Private debates are invitation-only. Open debates allow public viewing and participation.",
    type: "Free debates have no monetary incentive. Sponsored debates include prizes.",
    prizeAmount: "The reward offered to winning participants in sponsored debates."
};

export { tooltips };

// Field label with optional tooltip
const FieldLabel = ({ htmlFor, tooltip, children }) => {
    const [activeTooltip, setActiveTooltip] = useState(null);


    //css
    const labelClass = "block text-gray-700 text-md font-bold mb-2";


    const toggleTooltip = (fieldName) => {
        setActiveTooltip(activeTooltip === fieldName ? null : fieldName);
    };


    return (
        <div className="flex items-center gap-1 mb-1">
            <label className={labelClass} htmlFor={htmlFor}>{children}</label>
            {tooltip && (
                <div className="relative">
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => toggleTooltip(htmlFor)}
                    >
                        <Info size={16} />
                    </button>
                    {activeTooltip === htmlFor && (
                        <div className="absolute z-10 bg-gray-800 text-white text-xs rounded-none py-1 px-2 right-0 -mt-1 max-w-xs">
                            {tooltip}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FieldLabel;