import { useEffect, useState, useRef } from "react";
import Toastify from "../../utils/Toast";

import {
  useGetRolesQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../app/services/authApi";
import Swal from "sweetalert2";

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [currentRole, setCurrentRole] = useState(null);
  const [actionType, setActionType] = useState("add");
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const { data, isLoading, error, refetch } = useGetRolesQuery();
  const [addRole, { isLoading: isAdding }] = useAddRoleMutation();
  const [updateRole, { isLoading: isUpdating }] =
    useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] =
    useDeleteRoleMutation();

  useEffect(() => {
    if (data && data.roles) {
      // Sort roles by name
      const roles = [...data.roles]
      setRoles(roles.sort((a, b) =>
        a.roleName.localeCompare(b.roleName)
      ));
    }
  }, [data]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddRole = () => {
    setActionType("add");
    setRoleName("");
    //setIconColor("bg-blue-400");
    setCurrentRole(null);
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    setActionType("update");
    setRoleName(role.roleName);
    //setIconColor(role.iconColor);
    setCurrentRole(role);
    setShowModal(true);
    setShowDropdown(null);
  };

  const handleDeleteRole = (roleId) => {
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
        deleteRole(roleId)
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "Your role has been deleted.", "success");
            refetch();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the role.",
              "error"
            );
            console.error("Error deleting role:", error);
          });
      }
    });
    setShowDropdown(null);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      return;
    }

    try {
      if (actionType === "add") {
        const newRole = {
          roleName: roleName,
          // conColor: iconColor,
        };
        await addRole({ newRole }).unwrap();
      } else {
        const updatedRole = { roleName: roleName };
        await updateRole({
          id: currentRole._id,
          updatedRole,
        }).unwrap();
      }

      setShowModal(false);
      refetch();
    } catch (err) {
      Toastify(err?.message || "error occured", "warn");
      console.error("Error saving role:", error);
    }
  };

  const toggleDropdown = (roleId) => {
    setShowDropdown(showDropdown === roleId ? null : roleId);
  };

  if (isLoading) {
    return <div className="p-6">Loading roles...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading roles: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles ({roles.length})</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
          onClick={handleAddRole}
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No roles found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roles &&
            roles.length > 0 &&
            roles.map((role, index) => (
              <div
                key={role._id}
                className="border border-gray-200 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <span className="mr-4 text-gray-500">{index + 1}</span>
                    <span className="ml-4 text-lg font-medium">
                      {role.roleName}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => toggleDropdown(role._id)}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                    {showDropdown === role._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      >
                        <ul>
                          <li>
                            <button
                              onClick={() => handleEditRole(role)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              Update
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDeleteRole(role._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal for Add/Edit Role */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {actionType === "add" ? "Add New Role" : "Update Role"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
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

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="roleName"
              >
                Role Name
              </label>
              <input
                id="roleName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit}
                disabled={isAdding || isUpdating}
              >
                {isAdding || isUpdating
                  ? "Saving..."
                  : actionType === "add"
                  ? "Add Role"
                  : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
