"use client";
import React, { useState, useEffect } from "react";
import ExistingProposeWribate from "./Existing";
import Scrapped from "./Scrapped";

const ProposeWribateContent = () => {
  const [selectedSection, setSelectedSection] = useState("existing");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white shadow-md">
        <div className="container mx-auto ">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Desktop Navigation */}
            <nav className=" mx-auto my-2 flex gap-2">
              <button 
                onClick={() => setSelectedSection("existing")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSection === "existing" 
                    ? "bg-blue-900 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Existing
              </button>
              <button 
                onClick={() => setSelectedSection("scrapped")}
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSection === "scrapped" 
                    ? "bg-blue-900 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Scrapped
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 w-full overflow-y-auto ${isMobile && sidebarOpen ? "opacity-50" : ""}`}>
        <div className="container">
          {selectedSection === 'existing' ? (
            <ExistingProposeWribate/>
          ) : (
            <Scrapped/>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProposeWribateContent;