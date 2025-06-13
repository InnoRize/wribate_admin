"use client"
import ScrappedProposal from './ScrappedProposal';
import { useSelector } from "react-redux";


const ProposePage = () => {
  const {userRole} = useSelector((state) => state.auth)
    if(!userRole || userRole.toLowerCase() !== 'admin')
        return null
  return (
    <ScrappedProposal />
  );
};

export default ProposePage;