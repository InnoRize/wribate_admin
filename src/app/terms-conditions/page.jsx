'use client';
import ProtectedRoute from "../protected-route";
import TermsAndConditions from "../../Components/LegalPages/Terms/Terms";

export default function Page() {
    return <ProtectedRoute>
        <TermsAndConditions />
        </ProtectedRoute>;
}