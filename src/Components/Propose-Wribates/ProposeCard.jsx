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
import { setCurrentDebate } from "../../app/features/debateSlice";
import {setCurrentWribate} from "../../app/features/wribateSlice";

function DebateCard({ debate, user, setHook, hook, handleDelete, isDeleting,
  handleActionsClick, activeDropdown, dropdownRef
}) {
  const dispatch = useDispatch();
  const {userRole} = useSelector((state) => state.auth)
  const [votes, setVotes] = useState(debate.votes);
  // const [propDebate, setPropDebate] = useAtom(debateAtom);
  const [forUsers, setForUsers] = useState([]);
  const [againstUsers, setAgainstUsers] = useState([]);
  const [readyToWribate, setReadyToWribate] = useState(null);
  const [open, setOpen] = useState(false)
  const router = useRouter((state) => state.auth);

  const handleLaunch = () => {
    if (debate) {
      console.log(debate)
      dispatch(setCurrentWribate(debate));
      router.push(`/wribates/post-wribate`);
    }
  };
  
  const handleEdit = (debate) => {
    dispatch(setCurrentDebate(debate));
    router.push('propose-wribate/propose')
  };

  // Truncate context to 120 characters
  const truncatedContext = debate?.context ?
    debate.context.length > 120 ?
      `${debate.context.substring(0, 120)}...` :
      debate.context :
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
          <LaunchDialog
          isOpen={open}
          onClose={setOpen}
          debate={debate}
          />
          {/* Category banner */}
          {/* <div className="bg-blue-900 text-white text-xs px-3 py-1 uppercase tracking-wider font-medium">
            {debate.category}
          </div> */}

          <div className="p-4 flex flex-col h-full">
            {/* User info row with launch button - fixed height */}

            {/* Title with Image - fixed height */}
            <div className="min-h-[3rem] mb-2 flex items-start gap-3">
              {/* Title */}
              <div className="flex-1 min-w-0">
                <h2 className="text-md font-bold text-gray-900 leading-tight line-clamp-2">{debate.title}</h2>
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
              <span className="text-blue-900 font-medium">{debate.country}</span>
              <span>•</span>
              <span className="text-blue-900 font-medium">{debate.category}</span>
              <span>•</span>
              <div className="flex flex-wrap gap-1">
                {debate.tags &&
                  Array.isArray(debate.tags) &&
                  debate.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-xs">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              {/* {(readyToWribate || debate.ready) && (
                <Button
                  onClick={handleReadyToWribate}
                  variant="default"
                  size="sm"
                  className="flex gap-1 items-center text-white bg-blue-900 hover:bg-blue-800"
                >
                  <Rocket size={16} /> Ready To Wribate
                </Button>
              )} */}
              <Button
                onClick={handleLaunch}
                variant="default"
                size="sm"
                className="flex gap-1 items-center text-white bg-blue-900 hover:bg-blue-800"
              >
                <PlayCircle size={16} /> Quick Launch
              </Button>
            </div>

            {/* For/Against buttons */}
            <div className="">
              {/* <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpvote("for")}
                  className="flex gap-1 items-center border-red-600 text-red-600 hover:bg-green-50 flex-1"
                >
                  <ThumbsUp size={14} /> For {` ${formatLikes(debate?.votesFor < 0 ? 0 : debate.votesFor)}`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpvote("against")}
                  className="flex gap-1 items-center border-blue-600 text-blue-600 hover:bg-red-50 flex-1"
                >
                  <ThumbsDown size={14} /> Against {` ${formatLikes(debate?.votesAgainst < 0 ? 0 : debate.votesAgainst)}`}
                </Button>
              </div> */}

              {/* User avatars for For/Against */}
              <div className="flex justify-between pt-2">
                {/* For users */}
                {/* <div className="flex items-center">
                  <div className="flex -space-x-2 mr-2">
                    {forUsers.slice(0, 4).map((user, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden flex-shrink-0"
                      >
                        {user?.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={`User ${i}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-red-600 text-white flex items-center justify-center text-xs uppercase">
                            {user?.name?.[0] || "?"}
                          </div>
                        )}
                      </div>
                    ))}
                    {forUsers.length > 4 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{forUsers.length - 4}
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Against users */}
                {/* <div className="flex items-center">
                  <div className="flex -space-x-2 ml-2">
                    {againstUsers.slice(0, 4).map((user, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden flex-shrink-0"
                      >
                        {user?.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={`User ${i}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-xs uppercase">
                            {user?.name?.[0] || "?"}
                          </div>
                        )}
                      </div>
                    ))}
                    {againstUsers.length > 4 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{againstUsers.length - 4}
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
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
                <button
                  onClick={() => handleDelete(debate._id)}
                  disabled={isDeleting}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        }
      </div>
      
    </div>
  );
}

export default DebateCard;