"use client"
import React, { useState } from 'react';
import SinglePropose from './SinglePropose';
import BatchPropose from './BatchedPropose';
import { useSelector } from "react-redux";

const ProposePage = () => {
  const [selected, setSelected] = useState("single");
  const {user} = useSelector((state) => state.auth)

  return (
    <section className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-2">
            Topic Proposals
          </h1>
          {/* <p className="text-sm sm:text-base text-gray-600 px-2">
            Submit single topics or batch upload multiple proposals
          </p> */}
        </div>

        {/* Toggle Buttons */}
        {
          (user?.userRole != "user") && (
            <>
              <div className="flex justify-center mb-6 sm:mb-8 px-2">
                <div className="bg-white rounded-lg p-1 shadow-md border border-gray-200 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row">
                    <button
                      onClick={() => setSelected("single")}
                      className={`px-4 sm:px-6 py-2.5 sm:py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base mb-1 sm:mb-0 ${selected === "single"
                          ? "bg-blue-900 text-white shadow-sm"
                          : "text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                        }`}
                    >
                      Propose Single Topic
                    </button>
                    <button
                      onClick={() => setSelected("batch")}
                      className={`px-4 sm:px-6 py-2.5 sm:py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${selected === "batch"
                          ? "bg-blue-900 text-white shadow-sm"
                          : "text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                        }`}
                    >
                      Propose Multiple Topics
                    </button>
                  </div>
                </div>
              </div>
            </>
          )
        }

        {/* Content */}
        <div className="transition-all duration-300">
          {selected === "single" && <SinglePropose />}
          {selected === "batch" && <BatchPropose />}
        </div>
      </div>
    </section>
  );
};

export default ProposePage;