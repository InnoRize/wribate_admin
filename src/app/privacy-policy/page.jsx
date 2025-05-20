'use client';
import LegalPages from "../../Components/Terms/LegalPages";
import ProtectedRoute from "../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <LegalPages />
        </ProtectedRoute>;
}