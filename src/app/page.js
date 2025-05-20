'use client';

import Dashboard from "../Components/dashboard/Dashboard";
import ProtectedRoute from "./protected-route";
export default function Page() {
    return <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>; 
}