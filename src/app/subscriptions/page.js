'use client';
import Plans from "../../Components/Subscriptions/Plans/Plans";
import ProtectedRoute from "../protected-route";

export default function Page() {
    return <ProtectedRoute>
        <div className="bg-gray-50 py-12 px-4 md:px-10 lg:px-20">
            {/* Header Section */}

            {/* Pricing Table */}
            <Plans />

            {/* Why Go Premium Section */}

        </div>
        </ProtectedRoute>;
}
