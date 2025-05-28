import { useState, useEffect, useRef } from "react";
import {
  useDeleteSubscriptionMutation,
  useGetSubscriptionsQuery,
} from "../../app/services/authApi";
import Toastify from "../../utils/Toast";
import { Button } from "../ui/button";
import { PlusCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentSubscription, clearSubscription} from '../../app/features/subscriptionSlice'
import { Description } from "./Description";
import {DisplaySubscription} from "./DisplaySubscription"

export default function SubscriptionsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [modalData, setModalData] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();


  const { data: subscriptionsData, isLoading, error, refetch } = useGetSubscriptionsQuery();
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  // Handle click outside to close dropdowns
  useEffect(() => {
    refetch()
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

  // Process subscriptions data
  useEffect(() => {
    if (subscriptionsData) {
      let processedSubscriptions = subscriptionsData.subscriptions.map((sub) => ({
        ...sub,
        // premiumStarts: user.subscription?.startDate || null,
        // premiumEnds: user.subscription?.expiryDate || null,
      }));

      // Filter subscriptions based on search query
      const filtered = processedSubscriptions.filter((sub) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          sub.name?.toLowerCase().includes(searchLower) ||
          sub.currency?.toLowerCase().includes(searchLower) ||
          sub._id?.includes(searchQuery) ||
          sub.description?.toLowerCase().includes(searchLower) ||
          sub.pricePerDuration?.toLowerCase().includes(searchLower)
        );
      });

      // Sort subscriptions
      const sorted = [...filtered].sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        // Handle dates
        if (
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

      setTotalSubscriptions(sorted.length);

      // Paginate subscriptions
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedSubscriptions = sorted.slice(startIndex, startIndex + rowsPerPage);

      setFilteredSubscriptions(paginatedSubscriptions);
    }
  }, [
    subscriptionsData,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    rowsPerPage,
  ]);

  const totalPages = Math.ceil(totalSubscriptions / rowsPerPage);

  const handleActionsClick = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleDelete = (subId) => {
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
        deleteSubscription(subId)
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "The subscription has been deleted.", "success");
            refetch();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the subscription.",
              "error"
            );
            console.error("Error deleting subscription:", error);
          });
      }
    });
  }

  const handleEdit = (sub) =>{
    if (sub){
      dispatch(setCurrentSubscription(sub))
      router.push("/subscriptions/manage-subscription")
    }
    else {
      Swal.fire(
        "Error!",
        "Subscription not found.",
        "error"
      );
      console.error("Subscription not found");
    }
  }

  const handleAddSub = () =>{
    dispatch(clearSubscription())
    router.push("/subscriptions/manage-subscription")
  }


  if (isLoading) {
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
            Loading subscriptions...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading subscriptions</p>
          <p className="text-sm">
            {error.data?.message || error.error || "Something went wrong"}
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
      <h1 className="text-2xl font-semibold mb-4">Subscriptions ({totalSubscriptions})</h1>

      {/* Search Bar */}
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, description, duration or ID"
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
        <Button onClick={handleAddSub }
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle size={18} className="mr-1" />
            Add Subscription
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Cost
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No subscriptions found
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {sub.name || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {sub.currency + " " + sub.price + "/" + sub.pricePerDuration}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {sub.duration + " " + sub.pricePerDuration}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 ">
                    <div className="hover:cursor-pointer flex justify-start"
                      onClick={() => setModalData({
                        name:sub.name,
                        description: sub.description,
                        cost: sub.currency + " " + sub.price + "/" + sub.pricePerDuration
                        
                      })}
                    >
                      <Eye className = "mr-1" />
                      <div>
                        View
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium relative">
                    <button
                      onClick={() => handleActionsClick(sub._id)}
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

                    {activeDropdown === sub._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
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

      {/* Modal for Viewing Description */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {modalData.name}: Description
              </h3>
              <button
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="mb-4 max-h-[80vh] overflow-y-auto">
              <DisplaySubscription description={modalData.description} cost={modalData.cost} />
              {/* <Description description={sub.description} disableEdit={true}/> */}         
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
