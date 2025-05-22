"use client"
import React, { useState, useRef } from "react";
import { useCreateBatchWribateMutation } from "../../../app/services/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const BatchWribateUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [organisationName, setOrganisationName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [rotate, setRotate] = useState("free");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [createBatchWribate, { isLoading, error }] =
    useCreateBatchWribateMutation();
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("institution", organisationName);
    data.append("judges", displayName);

    console.log(data);
    try {
      const response = await createBatchWribate(data).unwrap();
      console.log(response?.statusCode);
      console.log(response.statusCode == 200);
      console.log(response.status);
      if (response) {
        toast.success("wribate created successfully", "success");
        router.push("/");
      } else {
        console.log(response);
        toast.error(
          response?.message || "error occured while creating wribate",
          "error"
        );
      }
    } catch (err) {
      console.log(err.data);
      console.error(err);
      toast.error(err?.message || "error occured while creating wribate", "error");
    }
  };

  const sampleData = [
    { id: 1, name: "John", email: "abc@gmail.com", date: "DD-MM-YYYY" },
    { id: 2, name: "Sara", email: "xyz@gmail.com", date: "DD-MM-YYYY" },
    { id: 3, name: "Ravi", email: "ravi@ravi.com", date: "DD-MM-YYYY" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-lg font-medium mb-2">
          Upload Batch Wribates in Below Format. Batch Wribates are Private by
          default until the Wribate is concluded.
        </h1>

        {/* Sample Table */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">No.</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Submit</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row) => (
                <tr key={row.id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {row.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {row.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-blue-500">
                    {row.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {row.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Template Download Link */}
        <div className="mb-6">
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            Download Template Excel File
          </a>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className="bg-blue-200 text-center p-8 rounded-md mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <div className="mb-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-white text-gray-700 font-medium py-2 px-4 rounded inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>CHOOSE FILES</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".xlsx,.xls,.csv"
          />
        </div>

        <p className="text-white">or drop files here</p>

        {/* Display selected file */}
        {selectedFile && (
          <div className="mt-4 bg-white p-3 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-blue-500 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-gray-700">
                {selectedFile.name}
              </span>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setSelectedFile(null)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <label className="w-32 mb-1 sm:mb-0">Organisation :</label>
          <input
            type="text"
            placeholder="Organisation Name"
            className="flex-1 p-2 border border-gray-300 rounded"
            value={organisationName}
            onChange={(e) => setOrganisationName(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <label className="w-32 mb-1 sm:mb-0">Submitted By :</label>
          <input
            type="text"
            placeholder="Display Name"
            className="flex-1 p-2 border border-gray-300 rounded"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <label className="w-32 mb-1 sm:mb-0">Rotate</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="rotate"
                value="free"
                checked={rotate === "free"}
                onChange={() => setRotate("free")}
                className="mr-1"
              />
              <span>Free</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="rotate"
                value="premium"
                checked={rotate === "premium"}
                onChange={() => setRotate("premium")}
                className="mr-1"
              />
              <span>Premium</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          disabled={!selectedFile || !organisationName || !displayName}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BatchWribateUpload;
