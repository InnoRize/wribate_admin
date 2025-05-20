'use client';
import Countries from "../../Components/Countries/Countries";
import ProtectedRoute from "../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <Countries />
        </ProtectedRoute>;
}