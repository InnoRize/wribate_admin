import { useState, useEffect, useRef } from "react";
import {
  useGetCategoriesQuery,
  useGetMyWribatesByCategoryQuery,
  useDeleteWribateMutation,
} from "../../app/services/authApi";
import { Button } from '../../Components/ui/button';
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentWribate, clearWribate } from "../../app/features/wribateSlice";
import Swal from "sweetalert2";

export default function Wribates() {
  const dispatch = useDispatch();
  const {userRole, userId} = useSelector((state) => state.auth)

  // Table state management
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const categoryAllWribates = "ALL"
  const router = useRouter();

  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories using RTK Query
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const [deleteWribate, { isLoading: isDeleting }] = useDeleteWribateMutation();

  // Set initial category when categories are loaded
  useEffect(() => {
    if (categoriesData?.catgories) {
      const categoriesList = [{categoryName: categoryAllWribates, }, ...categoriesData.catgories]
      setSelectedCategory(categoriesList[0].categoryName);
    }
  }, [categoriesData]);

  // Fetch wribates for the selected category
  const {
    data: wribatesData,
    isLoading: wribatesLoading,
    isError: wribatesError,
    refetch,
  } = useGetMyWribatesByCategoryQuery(selectedCategory || categoryAllWribates, // Use the selected category or "ALL" if none is selected
    { skip: !selectedCategory,} // Skip this query if no category is selected
  );

  const [filteredWribates, setFilteredWribates] = useState([]);
  const [totalWribates, setTotalWribates] = useState(0);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Process wribates data
  useEffect(() => {
    if (wribatesData?.data) {
      // Combine all types of wribates into a single array
      const { ongoing, completed, freeWribates, sponsoredWribates } = wribatesData.data;

      const allWribates = new Map();

      function addWribates(wribates, type) {
        for (const wribate of wribates) {
          const id = wribate._id;
          if (!allWribates.has(id)) {
            allWribates.set(id, { ...wribate, statusType: [type] });
          } else {
            allWribates.get(id).statusType.push(type);
          }
        }
      }

      addWribates(ongoing, 'Ongoing');
      addWribates(completed, 'Completed');
      addWribates(freeWribates, 'Free');
      addWribates(sponsoredWribates, 'Sponsored');

      const processedWribates = Array.from(allWribates.values());

      // Store the total count of all wribates before filtering
      setTotalWribates(processedWribates.length);

      // Filter wribates based on search query
      const filtered = processedWribates.filter((wribate) => {
        // if (!searchQuery) return true; // If no search query, include all wribates

        const searchLower = searchQuery.toLowerCase();
        return (
          // Filtering out based on userRole
          (
            userRole?.toLowerCase()==='admin' || 
            (wribate.createdBy && wribate.createdBy == userId)
          )
          &&(
            (!searchQuery)
            &&(
              wribate.title?.toLowerCase().includes(searchLower) ||
              wribate.category?.toLowerCase().includes(searchLower) ||
              wribate.institution?.toLowerCase().includes(searchLower) ||
              wribate._id?.includes(searchQuery) ||
              wribate.statusType.some((status) =>
                status.toLowerCase().includes(searchLower)
              )
            )
          )
        );
      });

      // Sort wribates
      const sorted = [...filtered].sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        // Handle dates
        if (
          sortField === "startDate" ||
          sortField === "createdAt" ||
          sortField === "updatedAt"
        ) {
          fieldA = fieldA ? new Date(fieldA).getTime() : 0;
          fieldB = fieldB ? new Date(fieldB).getTime() : 0;
        }

        if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      // Update the total count of filtered wribates
      const filteredCount = filtered.length;

      // Paginate wribates
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedWribates = sorted.slice(
        startIndex,
        startIndex + rowsPerPage
      );

      setFilteredWribates(paginatedWribates);
      setTotalWribates(filteredCount); // Update to show count of filtered results
    }
  }, [
    wribatesData,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    rowsPerPage,
  ]);

  const totalPages = Math.ceil(totalWribates / rowsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    return `${date.toLocaleDateString(
      "en-US",
      options
    )}\n${date.toLocaleTimeString("en-US", timeOptions)}`;
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleActionsClick = (wribateId) => {
    setActiveDropdown(activeDropdown === wribateId ? null : wribateId);
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Status badge styling
  const getStatusClass = (status) => {
    switch (status) {
      case "Ongoing":
        return "text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-xs";
      case "Completed":
        return "text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs";
      case "Free":
        return "text-purple-700 bg-purple-100 px-2 py-1 rounded-full text-xs";
      case "Sponsored":
        return "text-amber-700 bg-amber-100 px-2 py-1 rounded-full text-xs";
      default:
        return "text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs";
    }
  };

  const handleCreate = () => {
    dispatch(clearWribate());
    router.push("/wribates/post-wribate");
  }

  const handleDelete = (wribateId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWribate(wribateId)
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "Your wribate has been deleted.", "success");
            refetch();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the wribate.",
              "error"
            );
            console.error("Error deleting wribate:", error);
          });
      }
    });
  };

  const handleEdit = (wribate) => {
    if (wribate) {
      dispatch(setCurrentWribate(wribate));
      router.push(`/wribates/post-wribate`);
    }
    else {
      Swal.fire(
        "Error!",
        "Wribate not found.",
        "error"
      );
      console.error("Wribate not found");
    }
  };

  if (categoriesLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">
            Loading categories...
          </span>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading categories</p>
          <p className="text-sm">
            {categoriesError.data?.message ||
              categoriesError.error ||
              "Something went wrong"}
          </p>
          <button
            onClick={refetch}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">
        Wribates ({totalWribates})
      </h1>

      {/* Category Selector - Horizontal row with scrolling */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2 whitespace-nowrap">
            {[{categoryName: categoryAllWribates, _id: categoryAllWribates}, ...categoriesData?.catgories].map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryChange(category.categoryName)}
                className={`px-4 py-2 rounded-md flex-shrink-0 ${
                  selectedCategory === category.categoryName
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, category, institution or status"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        <Button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle size={18} className="mr-1" />
          Create Wribate
        </Button>
      </div>

      {wribatesLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-700">Loading wribates...</span>
          </div>
        </div>
      ) : wribatesError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading wribates</p>
          <p className="text-sm">
            {wribatesError.data?.message ||
              wribatesError.error ||
              "Something went wrong"}
          </p>
          <button
            onClick={refetch}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Institution
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Scope
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() => toggleSort("startDate")}
                >
                  Start Date{" "}
                  {sortField === "startDate" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Prize
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredWribates.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No wribates found
                  </td>
                </tr>
              ) : (
                filteredWribates.map((wribate) => (
                  <tr
                    key={wribate._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={wribate.coverImage || "/api/placeholder/40/40"}
                            alt={wribate.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {wribate.title || "Untitled Wribate"}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            ID: {wribate._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {wribate.category || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {wribate.institution || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {wribate.type || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {(wribate.scope === "Open"? "Open to All": wribate.scope) || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-pre-line">
                      {formatDate(wribate.startDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {wribate.durationDays} day(s)
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {wribate.prizeAmount ? `$${wribate.prizeAmount}` : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {wribate.statusType.map((status, index) => (
                        <span key={index} className={getStatusClass(status)} style={{ marginRight: '0.5rem' }}>
                          {status}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium relative">
                      <button
                        onClick={() => handleActionsClick(wribate._id)}
                        className="text-gray-400 hover:text-gray-900"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>

                      {activeDropdown === wribate._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                        >
                          <div className="py-1">
                            <button onClick={() => 
                              window.open(`${process.env.NEXT_PUBLIC_APP_BASE_MAIN_URL}/wribate/${wribate._id}`,'_blank')
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View
                            </button>
                            <button onClick={() => handleEdit(wribate)}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(wribate._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 border-t border-gray-200 pt-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-gray-300 rounded-md text-sm p-1"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-4">
            {totalWribates > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                  currentPage * rowsPerPage,
                  totalWribates
                )} of ${totalWribates}`
              : "0 results"}
          </span>
          <div className="flex items-center">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-1 rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
