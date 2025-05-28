'use client';
import UserForm from "../../../Components/Users/Edit";
import { useSelector } from "react-redux";

export default function Page() {
    const {userRole} = useSelector((state) => state.auth)
    if(userRole.toLowerCase() !== 'admin')
        return null
    return <UserForm/>
}
