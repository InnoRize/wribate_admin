"use client";
import React, { useState, useEffect } from "react";
import Introduction from './Privacy/Introduction';
import Two from './Privacy/Two';
import Three from './Privacy/Three';
import Four from './Privacy/Four';
import Five from './Privacy/Five';
import Six from './Privacy/Six';
import Seven from './Privacy/Seven';
import Eight from './Privacy/Eight';
import Nine from './Privacy/Nine';
import Terms from './Terms/Terms';
import { useRouter } from "next/navigation";

const LegalPages = () => {
  const [selectedSection, setSelectedSection] = useState("privacy");
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
                onClick={() => setSelectedSection("privacy")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSection === "privacy" 
                    ? "bg-blue-900 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setSelectedSection("terms")}
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSection === "terms" 
                    ? "bg-blue-900 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Terms and Conditions
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 w-full p-4 md:p-6 lg:p-8 overflow-y-auto ${isMobile && sidebarOpen ? "opacity-50" : ""}`}>
        <div className="container mx-auto max-w-4xl">
          {selectedSection === 'privacy' ? (
            <div className="space-y-8">
              <Introduction />
              <Two />
              <Three />
              <Four />
              <Five />
              <Six />
              <Seven />
              <Eight />
              <Nine />
            </div>
          ) : (
            <Terms />
          )}
        </div>
      </main>
    </div>
  );
};

export default LegalPages;