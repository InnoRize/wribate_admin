import { useRouter } from "next/navigation";
import { PlayCircle, ThumbsUp, ThumbsDown, Rocket, Pencil, Trash } from "lucide-react";
// import { debateAtom } from "../../states/GlobalStates";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
// import { useAtom } from "jotai";
import toast from "react-hot-toast";
import axios from "axios";
import authHeader from "../../utils/authHeader";
import LaunchDialog from "./LaunchDialog";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentScrapped } from "../../app/features/scrappedSlice";

function ScrapCard({ debate, user, setHook, hook, handleDelete, isDeleting,
  handleActionsClick, activeDropdown, dropdownRef
}) {
  const dispatch = useDispatch();
  const {userRole} = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const router = useRouter((state) => state.auth);

  const handleEdit = (debate) => {
    dispatch(setCurrentScrapped(debate));
    router.push('propose-wribate/scrapped');
  };

  // Truncate context to 120 characters
  const truncatedContext = debate?.revisedDebateContext ?
    debate.revisedDebateContext.length > 120 ?
      `${debate.revisedDebateContext.substring(0, 120)}...` :
      debate.revisedDebateContext :
    "No context provided.";

  function formatLikes(number) {
    if (number < 1000) return number.toString();

    const units = ["", "K", "M", "B", "T"];
    const index = Math.floor(Math.log10(number) / 3);
    const shortNumber = number / Math.pow(1000, index);

    return `${shortNumber.toFixed(1).replace(/\.0$/, "")}${units[index]}`;
  }

  return (
    
    <div className="bg-white border-1 border-gray-300 hover:shadow-xl shadow-md flex flex-col">
      <div className="flex flex-row">
        <div className="w-full cursor-pointer "
          onClick={() => setOpen(!open)}
        >
          <div className="p-4 flex flex-col h-full">
            {/* User info row with launch button - fixed height */}

            {/* Title with Image - fixed height */}
            <div className="min-h-[3rem] mb-2 flex items-start gap-3">
              {/* Title */}
              <div className="flex-1 min-w-0">
                <h2 className="text-md font-bold text-gray-900 leading-tight line-clamp-2">{debate.revisedTitle}</h2>
              </div>

              {/* Small image rectangle */}
              <div className="w-18 h-12 flex-shrink-0 rounded overflow-hidden ">
                {debate.image ? (
                  <img
                    src={debate.image}
                    alt="Debate topic"
                    className="w-full h-full object-fill border border-gray-200"
                  />
                ) : (
                  <div className="w-full h-full "></div>
                )}
              </div>
            </div>

            {/* Context - fixed height */}
            <div className="text-sm text-gray-700 border-l-4 border-gray-200 pl-3 min-h-[3rem] mb-2">
              <p className="line-clamp-3">{truncatedContext}</p>
            </div>

            {/* Country and tags - fixed height */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 min-h-[2rem] mb-2">
              <span className="text-blue-900 font-medium">{debate.revisedCountry}</span>
              <span>•</span>
              <span className="text-blue-900 font-medium">{debate.revisedCategory}</span>
            </div>
          </div>
        </div>
        {userRole.toLowerCase() === 'admin' &&
        <div className="mt-4 mr-2 relative ">
          <button
            onClick={() => handleActionsClick(debate._id)}
            className="text-gray-400 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </button>

          {activeDropdown === debate._id && (
            <div
              ref={dropdownRef}
              // className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              className="absolute top-0 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
            >
              <div className="py-1">
                <button
                  onClick={() => handleEdit(debate)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Edit
                </button>
                {debate.status !== 'approved' &&
                <button
                  onClick={() => handleDelete(debate._id)}
                  disabled={isDeleting}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
                }
              </div>
            </div>
          )}
        </div>
        }
      </div>
      
    </div>
  );
}

export default ScrapCard;