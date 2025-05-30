import { useState, useEffect, useRef } from "react";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../app/services/authApi";
import Toastify from "../../utils/Toast";
import { Button } from "../../Components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentUser, clearUser} from '../../app/features/userSlice'
import axios from "axios";

export default function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const {userRole} = useSelector((state) => state.auth)

  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery();

  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Handle click outside to close dropdowns
  useEffect(() => {
    async function getRoles() {
      try{
          const token = localStorage.getItem("token")
          const res = await axios.get(
              process.env.NEXT_PUBLIC_APP_BASE_URL + '/admin/getRoles',
              { 
                  headers: {
                      'Authorization': `Bearer ${token}`
                  },
                  withCredentials: true 
              }
          )
          const roles = res.data.roles
          if(roles){
              setRoleOptions(roles)
          }
      }catch (err) {
          console.error(err);
      }
    }
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setAccessDropdown(null);
      }
    }
    getRoles()

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Process users data
  useEffect(() => {
    if (usersData) {
      let processedUsers = usersData.users.map((user) => ({
        ...user,
        premiumStarts: user.subscription?.startDate || null,
        premiumEnds: user.subscription?.expiryDate || null,
        // status: getStatusText(user.status),
      }));

      // Filter users based on search query
      const filtered = processedUsers.filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user._id?.includes(searchQuery) ||
          user.userName?.toLowerCase().includes(searchLower)
        );
      });

      // Sort users
      const sorted = [...filtered].sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        // Handle dates
        if (
          sortField === "createdAt" ||
          sortField === "updatedAt" ||
          sortField === "premiumStarts" ||
          sortField === "premiumEnds"
        ) {
          fieldA = fieldA ? new Date(fieldA).getTime() : 0;
          fieldB = fieldB ? new Date(fieldB).getTime() : 0;
        }

        if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      setTotalUsers(sorted.length);

      // Paginate users
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedUsers = sorted.slice(startIndex, startIndex + rowsPerPage);

      setFilteredUsers(paginatedUsers);
    }
  }, [
    usersData,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    rowsPerPage,
  ]);

  const getStatusText = (statusCode) => {
    switch (statusCode) {
      case 1:
        return "Active";
      case 2:
        return "Deactivated";
      case 3:
        return "Deleted";
      default:
        return "Unknown";
    }
  };

  const totalPages = Math.ceil(totalUsers / rowsPerPage);

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

  const handleActionsClick = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const updatedStatus = { status: newStatus };
      const response = await updateUserStatus({
        id: userId,
        updatedStatus,
      }).unwrap();
      if (response?.status == 1) {
        Toastify("user status updated", "success");
        refetch();
      }
    } catch (err) {
      Toastify(
        err.data?.message || `Failed to ${newStatus.toLowerCase()} user`,
        "warn"
      );
    }

    setActiveDropdown(null);
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
      case "Active":
        return "text-green-700";
      case "Deactivated":
        return "text-yellow-700";
      case "Deleted":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const handleAddUser = () =>{
    dispatch(clearUser())
    router.push("/users/manage-user")
  }

  const handleEdit = (user) =>{
    if (user){
      dispatch(setCurrentUser(user))
      router.push("/users/manage-user")
    }
    else {
      Swal.fire(
        "Error!",
        "user not found.",
        "error"
      );
      console.error("user not found");
    }
  }

  const formatRoles = (rolesId)=>{
    let rolesList = []
    if (rolesId && roleOptions){
      for (let i = 0; i < rolesId.length; i++){
          const roleName = roleOptions.find(role => role._id == rolesId[i])?.roleName
          if(roleName){
            rolesList.push({
              _id: rolesId[i],
              roleName: roleName
            })
          }
      }
    }
    return rolesList.sort((a, b) =>
      a.roleName.localeCompare(b.roleName)
    )
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
            Loading users...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading users</p>
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
      <h1 className="text-2xl font-semibold mb-4">Users ({totalUsers})</h1>

      {/* Search Bar */}
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by user name, email or ID"
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
        {userRole.toLowerCase() === 'admin' &&
        <Button onClick={handleAddUser}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle size={18} className="mr-1" />
            Add User
        </Button>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Country
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Access Level
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                Created On{" "}
                {sortField === "createdAt" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Premium Starts
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Premium Ends
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
                <svg
                  className="w-4 h-4 inline-block ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {user.name?.charAt(0) || "U"}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.userName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user._id || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {user.name || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {user.country || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {user.email || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 relative">
                    <div 
                      className="w-full mt-1 min-h-[42px] p-1 flex flex-wrap items-center gap-1"
                    >
                      {/* Roles */}
                      {formatRoles(user.roles).map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
                        >
                          {role.roleName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-pre-line">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-pre-line">
                    {formatDate(user.premiumStarts)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-pre-line">
                    {formatDate(user.premiumEnds)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`${getStatusClass(user.status)}`}>
                      {getStatusText(user?.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium relative">
                    {userRole.toLowerCase() === 'admin' &&
                      <div>
                      <button
                        onClick={() => handleActionsClick(user._id)}
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

                      {activeDropdown === user._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleEdit(user)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            {user.status !== 2 && (
                              <button
                                onClick={() => handleStatusChange(user._id, 2)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Deactivate
                              </button>
                            )}
                            {user.status !== 1 && user.status !== 3 && (
                              <button
                                onClick={() => handleStatusChange(user._id, 1)}
                                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              >
                                Activate
                              </button>
                            )}
                            {user.status !== 3 && (
                              <button
                                onClick={() => handleStatusChange(user._id, 3)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
            {totalUsers > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                  currentPage * rowsPerPage,
                  totalUsers
                )} of ${totalUsers}`
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
