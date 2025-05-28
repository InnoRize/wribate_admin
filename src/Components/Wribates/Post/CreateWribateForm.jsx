"use client"
import { useEffect, useState } from "react";
import SingleWribate from "./SingleWribate";
import BatchedWribate from "./BatchedWribate";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from '../../../Components/ui/button';
import { Card, CardContent } from '../../../Components/ui/card';

const CreateWribateForm = () => {
  const [type, setType] = useState("single");
  const router = useRouter();

  return (
    <div className=" flex relative justify-center gap-4 items-start flex-col md:flex-row">
      <div className="w-full md:w-[75%]">
        {type == "single" && <SingleWribate />}
        {type == "batched" && <BatchedWribate />}
      </div>
      
    </div>
  );
};

export default CreateWribateForm;
