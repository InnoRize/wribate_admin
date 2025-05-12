import React, { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { FaTimes } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import Header from "./Header";
import { useGetProfileQuery } from "../app/services/authApi";
const SideNavbar = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { data, isLoading, error } = useGetProfileQuery();
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  if (data) {
    console.log(data);
  }

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setExpanded(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile) {
      setExpanded(false);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setExpanded(false);
    }
  };

  return (
    <div>
      {!isMobile && (
        <div className="flex h-screen relative">
          {/* Sidebar */}
          <div
            className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed md:relative t-0  z-10 h-screen ${
              expanded ? "w-64 scrolbar-hide" : "w-16"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Header with logo and hamburger */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              {expanded && (
                <img className="h-10 w-12" src="/logo.jpeg" alt="logo"></img>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
              <ul className="space-y-2 px-2">
                <li>
                  <Link
                    href="/"
                    className={`flex items-center p-1 md:p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/" ? "bg-purple-100" : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {expanded && <span className="ml-3">Home</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wribates"
                    className={`flex items-center p-1 md:p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/" ? "bg-purple-100" : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {expanded && <span className="ml-3">Wribates</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/users"
                    className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/add-wribate"
                        ? "bg-purple-100"
                        : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {expanded && (
                      <span className="ml-3 whitespace-nowrap">Users</span>
                    )}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/categories"
                    className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/about-us" ? "bg-purple-100" : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                    {expanded && (
                      <span className="ml-3 whitespace-nowrap">Categories</span>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User Profile */}
          </div>

          {/* Main Content */}
          <div className="flex-1 relative overflow-auto   scrollbar-hide">
            <div
              className={`fixed top-0 z-10  bg-white  ${
                expanded ? "left-64" : "left-16"
              } right-0`}
            >
              <Header
                expanded={expanded}
                data={data}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="mt-16">{children}</div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="min-h-screen">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
            <div className="p-2 relative">
              <div className="flex flex-row justify-between items-center gap-2">
                <img className="h-10 w-12" src="/logo.jpeg" alt="logo" />

                {/* Search Bar */}
                <div className="flex-1 mx-4">
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

                <FaBell size={20} className="text-gray-600" />
                <button
                  onClick={toggleMobileMenu}
                  ref={buttonRef}
                  className="p-1 rounded-md hover:bg-gray-100 focus:outline-none relative"
                >
                  {mobileMenu ? (
                    <FaTimes size={20} className="text-gray-600" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {mobileMenu && (
                <div
                  ref={menuRef}
                  className="absolute top-full right-0 mt-2 w-48 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/add-wribate"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Users
                    </Link>
                    <Link
                      href="/my-wribates"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Categories
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="pt-16 p-2">{children}</div>
        </div>
      )}
    </div>
  );
};

export default SideNavbar;
