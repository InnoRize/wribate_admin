'use client'

import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { FaTimes } from "react-icons/fa";
import Header from "./Header";
import { useGetProfileQuery } from "../app/services/authApi";
import { FileText, FileStack, Database, Tags, UserCheck, MapPin, SquareChartGantt } from "lucide-react";
import { useDispatch } from "react-redux";
import {setCredentials} from "../app/features/authSlice"
import { TbViewfinder } from "react-icons/tb";

const SideNavbar = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [expandedMaserData, setExpandedMasterData] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false)
  const dispatch = useDispatch()

  const { data, isLoading, error } = useGetProfileQuery();
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    async function validateToken(token) {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/validate-token', 
          {token}
        )
        if (res.data.status !== 1) {
          localStorage.removeItem('token')
          router.push('/signin')
        }
        setHasValidToken(true)
        dispatch(setCredentials(res.data?.data))
      }
      catch (error) {
        console.error('Token validation failed:', error)
        localStorage.removeItem('token')
        router.push('/signin')
      }
    }
    if (!token) {
      router.push('/signin')
    } else {
      validateToken(token)
    }

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

  const handleMasterDataClick = () => {
    setExpandedMasterData(expandedMaserData => !expandedMaserData);
  }

  const isPublicRoute = location.includes('/signin')

  return (
    <div>
      {!isMobile && (
        <div className="flex h-screen relative">
          {/* Sidebar */}
          { !isPublicRoute && hasValidToken && <div
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
                    href="/propose-wribate"
                    className={`flex items-center p-1 md:p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/" ? "bg-purple-100" : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <TbViewfinder className="w-5 h-5" />
                    {expanded && <span className="ml-3">Propose Wribate</span>}
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
                      className="h-8 w-8"
                      fill="none"
                      viewBox="5 5 48 48"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M31.42,31H28.62L26,22.56,23.35,31H20.55l-4-14H19l2.09,8.11,2.58-8.11H26l2.53,8.11L30.58,17h2.44Z"
                      />
                    </svg>
                    {expanded && <span className="">Wribates</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className={`flex items-center p-1 md:p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/" ? "bg-purple-100" : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <FileText className="w-5 h-5" />
                    {expanded && <span className="ml-3">Blogs</span>}
                  </Link>
                </li>
                {/* Master Data */}
                <li>
                  <div
                  className={`flex items-center p-2 rounded-lg cursor-pointer text-primary hover:bg-purple-100 ${
                  expanded ? "justify-start" : "justify-center"}`}
                  onClick={handleMasterDataClick}>
                    <Database className="w-5 h-5" />
                    {expanded && (
                      <span className="ml-3 whitespace-nowrap">Master Data</span>
                    )}
                  </div>
                  {/* Dropdown Links */}
                  {expanded && expandedMaserData && (
                  <ul className="ml-6 space-y-1">
                    <li>
                      <Link href="/categories"
                        className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                          location.pathname === "/about-us" ? "bg-purple-100" : ""
                        } ${expanded ? "justify-start" : "justify-center"}`}
                        onClick={handleLinkClick}
                      >
                        <Tags className="w-5 h-5" />
                        {expanded && (
                          <span className="ml-3 whitespace-nowrap">Categories</span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link href="/countries"
                        className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                          location.pathname === "/about-us" ? "bg-purple-100" : ""
                        } ${expanded ? "justify-start" : "justify-center"}`}
                        onClick={handleLinkClick}
                      >
                        <MapPin className="w-5 h-5" />
                        {expanded && (
                          <span className="ml-3 whitespace-nowrap">Countries</span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link href="/roles"
                        className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                          location.pathname === "/about-us" ? "bg-purple-100" : ""
                        } ${expanded ? "justify-start" : "justify-center"}`}
                        onClick={handleLinkClick}
                      >
                        <UserCheck className="w-5 h-5" />
                        {expanded && (
                          <span className="ml-3 whitespace-nowrap">Roles</span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link href="/subscriptions"
                        className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                          location.pathname === "/about-us" ? "bg-purple-100" : ""
                        } ${expanded ? "justify-start" : "justify-center"}`}
                        onClick={handleLinkClick}
                      >
                        <SquareChartGantt className="w-5 h-5" />
                        {expanded && (
                          <span className="ml-3 whitespace-nowrap">Subscriptions</span>
                        )}
                      </Link>
                    </li>
                  </ul>
                  )}
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
                    href="/pages"
                    className={`flex items-center p-2 rounded-lg text-primary hover:bg-purple-100 ${
                      location.pathname === "/pages" ? "bg-purple-100" : ""
                    } ${expanded ? "justify-start" : "justify-center"}`}
                    onClick={handleLinkClick}
                  >
                    <FileStack className="w-5 h-5" />
                    {expanded && (
                      <span className="ml-3 whitespace-nowrap">Pages</span>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User Profile */}
          </div>}

          {/* Main Content */}
          <div className="flex-1 relative overflow-auto   scrollbar-hide">
            {!isPublicRoute && hasValidToken && <div
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
            </div>}
            <div className={(isPublicRoute || !hasValidToken) ?"":"mt-16"}>{children}</div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="min-h-screen">
          {/* Fixed Header */}
          {!isPublicRoute && hasValidToken && <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
            <div className="p-2 relative">
              <div className="flex flex-row justify-between items-center gap-2">
                <img className="h-10 w-12" src="/logo.jpeg" alt="logo" />

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
                      href="/wribates"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Wribates
                    </Link>
                    <Link
                      href="/propose-wribate"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Propose Wribate
                    </Link>
                    <Link
                      href="/blogs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Blogs
                    </Link>
                    <div //Master Data
                    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                    onClick={handleMasterDataClick}
                    >
                      Master Data
                      {expandedMaserData && (
                      <ul className="ml-6 space-y-1">
                        <li>
                          <Link href="/categories"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                          >
                            Categories
                          </Link>
                        </li>
                        <li>
                          <Link href="/countries"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                          >
                            Countries
                          </Link>
                        </li>
                        <li>
                          <Link href="/roles"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                          >
                            Roles
                          </Link>
                        </li>
                        <li>
                          <Link href="/subscriptions"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                          >
                            Subscriptions
                          </Link>
                        </li>
                      </ul>
                      )}
                    </div>
                    <Link href="/users"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Users
                    </Link>
                    <Link href="/pages"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      Pages
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>}

          {/* Main Content Area */}
          <div className={(isPublicRoute || !hasValidToken) ?"":"pt-16 p-2"}>{children}</div>
        </div>
      )}
    </div>
  );
};

export default SideNavbar;
