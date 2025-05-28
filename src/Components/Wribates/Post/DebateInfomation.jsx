import React, { useState, useEffect, useRef } from 'react'
import { Upload, Award, ChevronRight, Search, X } from "lucide-react";
import axios from 'axios';
import FieldLabel, { tooltips } from './FieldLabel'
import toast from 'react-hot-toast';

// Searchable Dropdown Component
const SearchableDropdown = ({ id, name, value, onChange, options, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  // Filter options based on search term
  const filteredOptions = options?.filter(option => 
    typeof option === 'string' 
      ? option.toLowerCase().includes(searchTerm.toLowerCase())
      : (
        option.categoryName?
            option.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            : option.countryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option) => {
    const selectedValue = typeof option === 'string' ? option : (option.categoryName? option.categoryName : option.countryName);
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
    setSearchTerm('');
  };

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } });
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200 bg-gray-50";

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <div 
        className={`${inputClass} flex items-center justify-between cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-grow flex items-center">
          <Search size={16} className="text-gray-400 mr-2" />
          {isOpen ? (
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="flex-grow border-none bg-transparent focus:outline-none p-0"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={value ? 'text-black' : 'text-gray-400'}>
              {value || placeholder}
            </span>
          )}
        </div>
        {value && !isOpen && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions?.length > 0 ? (
            filteredOptions.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : (option.categoryName? option.categoryName : option.countryName);
              const optionId = typeof option === 'string' ? option : option._id;
              
              return (
                <div
                  key={optionId || index}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {optionValue}
                </div>
              );
            })
          ) : (
            <div className="p-3 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

const DebateInformation = ({ formData, handleInputChange, handleFileUpload, categoryOptions, countryOptions, userRole, setCurrentSection, imagePreview }) => {
    const inputClass = "w-full p-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-900 text-sm transition-all duration-200 bg-gray-200";

    // State for countries list and detection
    const [isLoading, setIsLoading] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    
    // Auto-detect user's country by IP when component mounts
    useEffect(() => {
        const detectUserCountry = async () => {
            // Only attempt detection if country is not already set
            if (formData.country) return;
            
            setIsDetectingLocation(true);
            try {
                // Using ipapi.co service for IP geolocation
                const res = await axios.get('https://ipapi.co/json/');
                if (res.data && res.data.country_name) {
                    // Update form data with detected country
                    handleInputChange({
                        target: {
                            name: 'country',
                            value: res.data.country_name
                        }
                    });
                }
            } catch (err) {
                console.log("Could not detect location:", err);
                // Silent failure as this is an enhancement
            } finally {
                setIsDetectingLocation(false);
            }
        };
        
        detectUserCountry();
    }, [formData.country, handleInputChange]); // Added dependencies to prevent lint warnings
    
    // Custom handler for dropdowns
    const handleDropdownChange = (e) => {
        handleInputChange(e);
    };

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-white p-2 mr-3">
                        <Award size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                </div>

                <div className="mb-6 ">
                    <FieldLabel htmlFor="title" tooltip={tooltips.title}>
                        Wribate Title*
                    </FieldLabel>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter a clear title for your debate"
                        required
                    />
                </div>

                <div className="mb-6">
                    <FieldLabel htmlFor="context" tooltip={tooltips.context}>
                        Context
                    </FieldLabel>
                    <textarea
                        id="context"
                        name="context"
                        value={formData.context}
                        onChange={handleInputChange}
                        className={`${inputClass} h-24`}
                        placeholder="Provide background information and context for the debate"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Optional: Additional context helps participants understand the scope of the debate
                    </p>
                </div>

                <div className="mb-6">
                    <FieldLabel htmlFor="coverImage" tooltip={tooltips.coverImage}>
                        Cover Image
                    </FieldLabel>
                    <div className="border border-dashed border-gray-300 p-6  bg-gray-200">
                        <div className="text-center">
                            {imagePreview ? (
                                <div className="mb-4">
                                    <img
                                        src={imagePreview}
                                        alt="Cover preview"
                                        className="mx-auto h-40 object-cover"
                                    />
                                </div>
                            ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            )}
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white hover:bg-blue-800 transition font-medium">
                                {imagePreview ? "Change Image" : "Select Image"}
                                <input
                                    id="coverImage"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                />
                            </label>
                            {formData?.coverImage && (
                                <p className="mt-3 text-sm text-gray-600 font-medium">
                                    Selected: {formData.coverImage.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FieldLabel htmlFor="category" tooltip={tooltips.category}>
                            Category*
                        </FieldLabel>
                        <SearchableDropdown
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleDropdownChange}
                            options={categoryOptions}
                            placeholder="Select a category"
                            required
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor="country" tooltip={tooltips.country || "Select the country relevant to this debate"}>
                            Country
                        </FieldLabel>
                        {isLoading ? (
                            <div className={`${inputClass} flex items-center`}>
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-900 rounded-full animate-spin mr-2"></div>
                                <span className="text-gray-500">Loading ...</span>
                            </div>
                        ) : (
                            <div className="relative">
                                <SearchableDropdown
                                    id="country"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleDropdownChange}
                                    options={countryOptions}
                                    placeholder={isDetectingLocation ? "Detecting your location..." : "Select a country"}
                                />
                                {isDetectingLocation && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {(!userRole || userRole?.toLowerCase() !== "user") && (
                    <div className="mt-6">
                        <FieldLabel htmlFor="institution" tooltip={tooltips.institution}>
                            Institution
                        </FieldLabel>
                        <input
                            id="institution"
                            type="text"
                            name="institution"
                            value={formData.institution || ""}
                            onChange={handleInputChange}
                            className={inputClass}
                            placeholder="Organization or school name"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-10">
                <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="bg-blue-900 text-white font-bold py-3 px-8 flex items-center"
                >
                    Next: Participants <ChevronRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    )
}

export default DebateInformation