"use client"
import { useEffect, useState } from "react";
import SingleWribate from "./SingleWribate";
import BatchedWribate from "./BatchedWribate";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from '../../../Components/ui/button';
import { Card, CardContent } from '../../../Components/ui/card';

const CreateWribateForm = () => {
  const {userId} = useSelector((state) => state.auth);
  const [type, setType] = useState("single");
  const router = useRouter();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <CardContent className="text-center">
            <p className="mb-4">Please log in to access your blogs.</p>
            <Button className="text-white" onClick={() => router.push('/signin')}>
              Go to Signin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
