import { Search, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "../Components/ui/label";

const SearchableDropdown = ({ title, keyString, options, value, handleFormChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const isObject = typeof options[0] === "object";

  const getLabel = (item) => (isObject ? item[keyString] : item);
  const getValue = (item) => (isObject ? item.value : item);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    handleFormChange(keyString, selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="grid gap-2">
      <Label className="font-semibold text-gray-800">{title}</Label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-12 px-3 py-2 text-left bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-900 focus:outline-none transition-colors flex items-center justify-between"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || `Select a ${title.toLowerCase()}`}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border-2 border-gray-200 shadow-lg z-50 max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const val = getValue(opt);
                  const lbl = getLabel(opt);
                  return (
                    <button
                      key={val + idx}
                      type="button"
                      onClick={() => handleSelect(val)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors
                          ${value === val ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                    >
                      {lbl}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No {title.toLowerCase()} found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;
