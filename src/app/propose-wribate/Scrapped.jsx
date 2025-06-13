'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "../../Components/ui/button";
import { SearchX, MoreHorizontal, Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Toast from "../../utils/Toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import authHeader from "../../utils/authHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "../../Components/ui/dropdown-menu";
import CountryDropdown from '../../Components/Propose-Wribates/CountryDropdown'
import ScrapCard from "../../Components/Propose-Wribates/ScrapCard";
import { setCurrentScrapped } from "../features/scrappedSlice";

export default function Scrapped() {
  const {user} = useSelector((state) => state.auth)

  const [scraps, setScraps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [hook, setHook] = useState(false);
  const [lastId, setLastId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const countryDropdownRef = useRef(null);
  const [filteredDebates, setFilteredDebates] = useState([])
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const statuses = ["rejected", "pending", "approved"];
  const statusLabels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };  
  const [activeTab, setActiveTab] = useState("approved");

  const filteredByTab = filteredDebates.filter((d) => d.status === activeTab);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Function to fetch scrapped data
  const fetchScraps = async () => {
    try {
      setIsLoading(true);
    //   // If reset is true, we're changing categories, so we need to reset scraps and lastId
    //   const id = reset ? "" : lastId;
      const token = localStorage.getItem("token");
      const res = await axios.get(process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/getScrappedProposals',
        { 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true 
        }    
      );
      const data = res.data;

      if (data.status) {
        setScraps(data?.scrappedProposals || []);
        
        // Update lastId for pagination
        const newLastId = data.propose?.[data.propose.length - 1]?._id;
        setLastId(newLastId || null);

        // Check if we have more to load
        setHasMore(data.propose && data.propose.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      Toast("Failed to load scraps","error");
    } finally {
      setIsLoading(false);
    }
  };

  // When category changes, reset and fetch new scraps
  useEffect(() => {
    setScraps([]);
    setLastId("");
    fetchScraps();
  }, [selectedCategory, hook]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_APP_BASE_URL + '/user/getallcategories', {
          headers: authHeader()
        });

        const data = res.data;
        if (data.res) {
          setCategories(data.categories);
        }
      }
      catch (err) {
        console.log(err);
        Toast("Error occurred while fetching categories","error");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all?fields=name');
        const data = res.data;
        // Sort countries alphabetically by common name
        const sortedCountries = data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
      } catch (err) {
        console.log(err);
        Toast("Error fetching countries","error");
        // Fallback to empty array if API fails
        setCountries([]);
      }
    };

    fetchCountries();
  }, []);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    // Filter scraps by both category and country
    const newDebates = scraps.filter((debate) => {
      const categoryMatch = selectedCategory === "All" || debate.category === selectedCategory;
      const countryMatch = selectedCountry === "All Countries" || debate.country === selectedCountry;
      return categoryMatch && countryMatch;
    })
    setFilteredDebates(newDebates)
  }, [scraps])

  const handleActionsClick = (debateId) => {
    setActiveDropdown(activeDropdown === debateId ? null : debateId);
  };

  // Handle load more button click
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchScraps();
    }
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token")
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/deleteScrappedProposal/${id}`,
        { 
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true 
        }
      );

      const data = res.data;
      if (data.status === 1) {
        setFilteredDebates((prev) => prev.filter((prop) => prop._id !== id));
        Toast("Blog deleted successfully","success");
      }
    } catch (err) {
      console.error(err);
      Toast("Failed to delete blog","error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Separate the visible and dropdown categories
  const visibleCategories = ["All", ...categories.slice(0, 6).map(cat => cat.categoryName)];
  const dropdownCategories = categories.slice(6).map(cat => cat.categoryName);

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-200">
      {/* Top Categories with Country Filter and Dropdown for more */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 w-full mx-auto">
        {/* Categories Navigation */}
        <div className="w-full sm:flex-grow overflow-hidden">
          <nav className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {visibleCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm px-3 py-1 transition-colors duration-200 whitespace-nowrap flex-shrink-0
                  ${selectedCategory === cat
                    ? 'border-b-2 border-blue-900 font-medium text-blue-900'
                    : 'text-gray-700 hover:text-blue-700'}
                `}
              >
                {cat}
              </button>
            ))}

            {dropdownCategories.length > 0 && (
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <button className="text-sm px-3 py-1 transition-colors duration-200 text-gray-700 hover:text-blue-700 focus:outline-none flex-shrink-0">
                    <MoreHorizontal size={20} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="p-2 bg-white">
                  <div className="grid sm:grid-cols-4 grid-cols-3 gap-2">
                    {dropdownCategories.map((cat, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onSelect={() => setSelectedCategory(cat)}
                        className={`text-sm px-2 py-2 rounded transition-colors duration-200 whitespace-nowrap cursor-pointer
              ${selectedCategory === cat
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-gray-700 hover:bg-gray-100'}
            `}
                      >
                        {cat}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* Country Filter Dropdown and Propose Button */}
        <div className="flex flex-row justify-end gap-4">
          {/* Country Dropdown - Full width on mobile, auto width on desktop */}
          <CountryDropdown
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            className="w-full sm:w-auto sm:min-w-[200px]"
          />

          <Button
            onClick={() => {
              if (user?._id) {
                dispatch(setCurrentScrapped(null))
                router.push('/propose-wribate/scrapped');
              } else {
                Toast("Please login to propose a topic.","error");
              }
            }}
            className="bg-blue-900  text-white"
          >
            Add Scrapped Proposal
          </Button>
        </div>
      </div>
      {filteredDebates.length > 0 ? (
        <>
        {/* Status Navbar */}
        <div className="flex justify-center space-x-4 mb-6 border-b pb-2">
            {statuses.map((status) => (
            <button
                key={status}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                activeTab == status
                    ? "border-b-2 border-blue-900 font-semibold text-blue-900"
                    : "border-transparent hover:font-bold "
                } ${status === "pending" ? "text-yellow-600" : status === "approved" ? "text-green-600" : "text-red-600"}`}
                onClick={() => setActiveTab(status)}
            >
                {statusLabels[status]}
            </button>
            ))}
        </div>

        {/* Debate Cards for Active Tab */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredByTab.map((debate) => (
            <ScrapCard
                key={debate._id}
                user={user}
                debate={debate}
                setHook={setHook}
                hook={hook}
                handleDelete={handleDelete}
                isDeleting={isDeleting}
                handleActionsClick={handleActionsClick}
                activeDropdown={activeDropdown}
                dropdownRef={dropdownRef}
            />
            ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8 mb-4">
            {hasMore && (
            <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-blue-900 text-white hover:bg-blue-800 transition-colors px-8 py-2"
            >
                {isLoading ? (
                <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Loading...
                </>
                ) : (
                'Load More Wribates'
                )}
            </Button>
            )}

            {!hasMore && filteredDebates.length > 0 && (
            <p className="text-gray-500 text-sm">No more wribates to load</p>
            )}
        </div>
        </>

      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <SearchX size={40} className="text-gray-300 mb-2" />
          <p className="text-gray-500">No topics are available to show</p>
          <p className="text-sm text-gray-400 mt-1">
            Try selecting a different category{selectedCountry !== "All Countries" && " or country"} or propose a new topic
          </p>
        </div>
      )}
    </div>
  );
} 