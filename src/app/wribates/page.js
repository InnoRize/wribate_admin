'use client';
import Wribates from "../../Components/Wribates/Wribates";
import ProtectedRoute from "../protected-route";
export default function Page() {
    return <ProtectedRoute>
        <Wribates />
    </ProtectedRoute>;
}