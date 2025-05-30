'use client';
import Post from "../../../Components/Blogs/Post/Post";
import { useSelector } from "react-redux";

export default function Page() {
    const {userRole} = useSelector((state) => state.auth)
    if(!userRole || userRole.toLowerCase() !== 'admin')
        return null
    return <Post />
}