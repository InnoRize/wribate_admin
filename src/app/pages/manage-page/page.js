'use client';
import PageForm from "../../../Components/Pages/Edit";
import { useSelector } from "react-redux";

export default function Page() {
    const {userRole} = useSelector((state) => state.auth)
    if(userRole.toLowerCase() !== 'admin')
        return null
    return <PageForm/>
}
