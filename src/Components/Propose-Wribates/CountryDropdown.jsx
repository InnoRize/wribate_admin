"use client";
import { useEffect, useState, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CountryDropdown({ selectedCountry, onCountrySelect, className = "" }) {
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        toast.error("Error fetching countries");
        // Fallback to empty array if API fails
        setCountries([]);
      }
    };

    fetchCountries();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle country selection
  const handleCountrySelect = (country) => {
    onCountrySelect(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors w-full justify-between"
      >
        <span className="truncate">
          {selectedCountry.length > 15 ? `${selectedCountry.slice(0, 15)}...` : selectedCountry}
        </span>
        <ChevronDown 
          size={16} 
          className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-60 overflow-y-auto">
            <button
              onClick={() => handleCountrySelect("All Countries")}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors
                ${selectedCountry === "All Countries" ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
              `}
            >
              All Countries
            </button>
            
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors
                    ${selectedCountry === country ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
                  `}
                >
                  {country}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}