import React from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {useRouter} from "next/navigation";

const Header = ({ expanded, data, isLoading, error }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  }

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 h-16 border-b border-gray-200">
      {/* Logo */}
      {!expanded && (
        <div className="flex items-center mb-3 sm:mb-0 hidden md:block">
          <div className="flex items-center">
            <div className="mr-2">
              <img src="/logo.jpeg" alt="Wribate Logo" className="h-12 w-15" />
            </div>
            <span className="text-2xl font-bold text-primary">Wribate</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="w-full sm:w-1/2 lg:w-2/3 mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for Topic..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-800 focus:border-purple-800 sm:text-sm"
          />
        </div>
      </div>

      <Button onClick={handleLogout}
       className="text-white" 
      >
      Logout
      </Button>

      {/* Notification Icon */}

      {/* User Actions */}
    </header>
  );
};

export default Header;
