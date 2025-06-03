import { X, Edit3, MapPin, BookOpen, Tag, AlertTriangle, Search, ChevronDown } from "lucide-react";
import axios from 'axios';
import  { useEffect, useState, useRef } from 'react';
import { Label } from "../../../Components/ui/label";


const CountryDropdown = ({ formData,handleFormChange }) => {

    const [countries, setCountries] = useState([]);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearchTerm, setCountrySearchTerm] = useState("");
    const countryDropdownRef = useRef(null);

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
            }
        };

        fetchCountries();
    }, []);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false);
                setCountrySearchTerm("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle country selection
    const handleCountrySelect = (country) => {
        handleFormChange("country", country);
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
    };


    const filteredCountries = countries.filter(country =>
        country.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );



    return (
        <div className="grid gap-2">
            <Label className="font-semibold text-gray-800 flex items-center">
                <MapPin className="mr-2" size={16} />
                Country
            </Label>
            <div className="relative" ref={countryDropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full h-12 px-3 py-2 text-left bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-900 focus:outline-none transition-colors flex items-center justify-between"
                >
                    <span className={formData.country ? "text-gray-900" : "text-gray-500"}>
                        {formData.country || "Select a country"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border-2 border-gray-200 shadow-lg z-50 max-h-80 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={countrySearchTerm}
                                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Countries List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors
                                                                    ${formData.country === country ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
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
        </div>
    )
}

export default CountryDropdown
