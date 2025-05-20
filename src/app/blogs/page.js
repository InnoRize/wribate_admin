'use client';
import Blogs from "../../Components/Blogs/Blogs";
import ProtectedRoute from "../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <Blogs />
    </ProtectedRoute>;
}