'use client';
import SubscriptionForm from "../../../Components/Subscriptions/Edit";
import { useSelector } from "react-redux";

export default function Page() {
    const {userRole} = useSelector((state) => state.auth)
    if(!userRole || userRole.toLowerCase() !== 'admin')
        return null
    return <SubscriptionForm/>
}
