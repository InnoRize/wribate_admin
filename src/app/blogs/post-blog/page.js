'use client';
import Post from "../../../Components/Blogs/Post/Post";
import ProtectedRoute from "../../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <Post />
    </ProtectedRoute>;
}