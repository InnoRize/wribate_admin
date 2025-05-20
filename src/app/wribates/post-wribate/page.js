'use client';
import CreateWribateForm from "../../../Components/Wribates/Post/CreateWribateForm";
import ProtectedRoute from "../../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <CreateWribateForm />
        </ProtectedRoute>;
}