import { Search, ChevronDown } from "lucide-react";
import axios from 'axios';
import  { useEffect, useState, useRef } from 'react';
import { Label } from "../../../Components/ui/label";

const CategoryDropdown = ({formData, handleFormChange, keyString, title}) => {
    const [categories, setCategories] = useState([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    // Refs for outside click detection
    const categoryDropdownRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_APP_BASE_URL + '/user/getallcategories');

                const data = res.data;
                if (data.res) {
                    setCategories(data.categories);
                }

            } catch (err) {
                console.log(err);
                toast.error("Error fetching categories");
            }
        };

        fetchCategories();
    }, []);

     // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
                setCategorySearchTerm("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

     // Handle category selection
    const handleCategorySelect = (revisedCategory) => {
        handleFormChange(keyString, revisedCategory);
        setIsCategoryDropdownOpen(false);
        setCategorySearchTerm("");
    };



    // Filter categories and countries based on search terms
    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );



    return (
        <div className="grid gap-2">
            <Label className="font-semibold text-gray-800">{title?title:'Category'}</Label>
            <div className="relative" ref={categoryDropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full h-12 px-3 py-2 text-left bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-900 focus:outline-none transition-colors flex items-center justify-between"
                >
                    <span className={formData.revisedCategory ? "text-gray-900" : "text-gray-500"}>
                        {formData.revisedCategory || "Select a category"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border-2 border-gray-200 shadow-lg z-50 max-h-80 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={categorySearchTerm}
                                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <button
                                        key={category._id}
                                        type="button"
                                        onClick={() => handleCategorySelect(category.categoryName)}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors
                                                                    ${formData.revisedCategory === category.categoryName ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
                                                                `}
                                    >
                                        {category.categoryName}
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                    No categories found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryDropdown
