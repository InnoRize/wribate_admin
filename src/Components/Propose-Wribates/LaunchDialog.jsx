import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    User,
    MessageSquare,
    Trophy,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    X
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
// import { useAtom } from "jotai";
// import { chatAtom, debateAtom } from "../../states/GlobalStates";

export default function LaunchDialog({ isOpen, onClose, debate }) {
    const [isInviting, setIsInviting] = useState({});
    const router = useRouter();
    const [lastId, setLastId] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // const [chatUser, setChatUser] = useAtom(chatAtom);

    const fetchUsers = async (isInitial = false) => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            const currentLastId = isInitial ? null : lastId;
            
            const url = new URL(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/getusers`);
            url.searchParams.append('wribateId', debate._id);
            url.searchParams.append('lastId', currentLastId || '');

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.res) {
                const newUsers = data.users || [];
                
                if (isInitial) {
                    setUsers(newUsers);
                } else {
                    setUsers(prevUsers => [...prevUsers, ...newUsers]);
                }
                
                const newLastId = newUsers?.[newUsers.length - 1]?._id;
                setLastId(newLastId || null);
                
                setHasMore(newUsers.length > 0 && newLastId);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load users");
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && debate?._id) {
            setUsers([]);
            setLastId(null);
            setHasMore(true);
            fetchUsers(true);
        }
    }, [isOpen, debate?._id]);

    // const handleInviteUser = async (userId, title, message) => {
    //     setChatUser({
    //         _id: userId,
    //         title,
    //         message
    //     });
    //     router.push('/messages');
    // };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchUsers(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(false);
        }
    };

    const handleDialogClick = (e) => {
        e.stopPropagation();
    };

    const UserCard = ({ user }) => {
        const sideColor = user.side === "for" ? "text-green-700" : "text-red-700";
        const sideBg = user.side === "for" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300";

        return (
            <div className="flex items-center justify-between p-5 border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                <div className="flex items-center gap-4">
                    {user.profilePhoto ? (
                        <div 
                            onClick={() => router.push('/profile/' + user.username)} 
                            className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-blue-900 transition-colors"
                        >
                            <Image
                                src={user.profilePhoto}
                                alt={user.name || "User"}
                                width={56}
                                height={56}
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div 
                            onClick={() => router.push('/profile/' + user.username)} 
                            className="w-14 h-14 rounded-full flex justify-center items-center bg-gray-100 border-2 border-gray-300 cursor-pointer hover:border-blue-900 transition-colors"
                        >
                            <User size={28} className="text-gray-600" />
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900">{user.name || "Anonymous"}</div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <Trophy size={16} className="text-yellow-600" />
                                <span className="text-sm font-medium text-gray-600">{user.wins || 0} Wins</span>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 border ${sideBg}`}>
                                {user.side === "for" ? (
                                    <ThumbsUp size={14} className={sideColor} />
                                ) : (
                                    <ThumbsDown size={14} className={sideColor} />
                                )}
                                <span className={`text-sm font-semibold ${sideColor}`}>
                                    {user.side === "for" ? "For" : "Against"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <Button
                    size="lg"
                    className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-2"
                    onClick={() => handleInviteUser(user._id, debate.title, "Let's Debate on this topic")}
                    disabled={isInviting[user._id]}
                >
                    <MessageSquare size={18} />
                    {isInviting[user._id] ? "Sending..." : "Message"}
                </Button> */}
            </div>
        );
    };

    if (!debate || !isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white max-h-full h-4/5 sm:max-w-2xl lg:max-w-4xl w-full flex flex-col overflow-hidden border-2 border-gray-300"
                onClick={handleDialogClick}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-white sticky top-0 z-10">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Topic Overview
                        </h2>
                        <button
                            onClick={() => onClose(false)}
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 border border-gray-300"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Debate details card */}
                    <div className="p-6 bg-blue-50 border-b-2 border-gray-200">
                        <div className="flex items-start gap-4 mb-6">
                            {debate.profilePhoto ? (
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-900">
                                    <Image
                                        src={debate.profilePhoto}
                                        alt={debate.username || "User"}
                                        width={64}
                                        height={64}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full flex justify-center items-center bg-white border-2 border-blue-900">
                                    <User size={32} className="text-blue-900" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="font-bold text-xl text-gray-900">{debate.username || "Anonymous"}</div>
                                <div className="text-blue-900 font-medium">Topic Creator</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-2xl text-gray-900 leading-tight mb-4">
                                    {debate.title || "Untitled Debate"}
                                </h3>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {debate.country && (
                                        <Badge className="bg-white text-gray-700 border-2 border-gray-300 font-semibold px-3 py-1">
                                            {debate.country}
                                        </Badge>
                                    )}
                                    {debate.category && (
                                        <Badge className="bg-blue-900 text-white border-0 font-semibold px-3 py-1">
                                            {debate.category}
                                        </Badge>
                                    )}
                                    {debate.tags && Array.isArray(debate.tags) && debate.tags.map((tag, index) => (
                                        <Badge key={index} className="bg-gray-200 text-gray-700 border border-gray-300 px-3 py-1">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {debate.image && (
                                <div className="w-24 h-20 overflow-hidden border-2 border-blue-900 flex-shrink-0">
                                    <Image
                                        src={debate.image}
                                        alt="Debate topic"
                                        width={96}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-5 border-2 border-gray-300">
                            <p className="text-gray-700 leading-relaxed text-base">
                                {debate.context || "No context provided"}
                            </p>
                        </div>
                    </div>

                    {/* Users section header */}
                    <div className="px-6 py-5 bg-white border-b-2 border-gray-200">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">
                            Participants ({users.length})
                        </h4>
                        <p className="text-gray-600">
                            Users who have taken a stance on this debate
                        </p>
                    </div>

                    {/* Users list */}
                    <div className="flex-1 bg-white">
                        <div className="divide-y-2 divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <UserCard key={user._id} user={user} />
                                ))
                            ) : !isLoading ? (
                                <div className="flex justify-center items-center h-40 text-gray-500">
                                    <div className="text-center">
                                        <User size={48} className="mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium">No participants yet</p>
                                        <p className="text-sm mt-1">Be the first to join this debate!</p>
                                    </div>
                                </div>
                            ) : null}
                            
                            {isLoading && (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 size={32} className="animate-spin text-blue-900 mr-3" />
                                    <span className="text-gray-600 text-lg">Loading participants...</span>
                                </div>
                            )}
                        </div>
                        
                        {!isLoading && hasMore && users.length > 0 && (
                            <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
                                <Button
                                    onClick={handleLoadMore}
                                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 text-lg font-semibold"
                                    disabled={isLoading}
                                >
                                    Load More Participants
                                </Button>
                            </div>
                        )}
                        
                        {!isLoading && !hasMore && users.length > 0 && (
                            <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
                                <p className="text-center text-gray-500 font-medium">
                                    All participants loaded
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}