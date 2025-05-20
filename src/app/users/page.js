'use client';
import Users from "../../Components/Users/Users";
import ProtectedRoute from "../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <Users />
        </ProtectedRoute>;
}