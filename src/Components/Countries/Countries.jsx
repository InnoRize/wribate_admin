import { useEffect, useState, useRef } from "react";
import Toastify from "../../utils/Toast";

import {
  useGetCountriesQuery,
  useAddCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} from "../../app/services/authApi";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

export default function CountriesList() {
  const {userRole} = useSelector((state) => state.auth)
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [countryName, setCountryName] = useState("");
  //const [iconColor, setIconColor] = useState("bg-blue-400");
  const [currentCountry, setCurrentCountry] = useState(null);
  const [actionType, setActionType] = useState("add"); // "add" or "update"
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const { data, isLoading, error, refetch } = useGetCountriesQuery();
  const [addCountry, { isLoading: isAdding }] = useAddCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] =
    useUpdateCountryMutation();
  const [deleteCountry, { isLoading: isDeleting }] =
    useDeleteCountryMutation();

  useEffect(() => {
    if (data && data.countries) {
      // Sort countries by name
      const countries = [...data.countries]
      setCountries(countries.sort((a, b) =>
        a.countryName.localeCompare(b.countryName)
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

  const handleAddCountry = () => {
    setActionType("add");
    setCountryName("");
    //setIconColor("bg-blue-400");
    setCurrentCountry(null);
    setShowModal(true);
  };

  const handleEditCountry = (country) => {
    setActionType("update");
    setCountryName(country.countryName);
    //setIconColor(country.iconColor);
    setCurrentCountry(country);
    setShowModal(true);
    setShowDropdown(null);
  };

  const handleDeleteCountry = (countryId) => {
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
        deleteCountry(countryId)
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "Your country has been deleted.", "success");
            refetch();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the country.",
              "error"
            );
            console.error("Error deleting country:", error);
          });
      }
    });
    setShowDropdown(null);
  };

  const handleSubmit = async () => {
    if (!countryName.trim()) {
      return;
    }

    try {
      if (actionType === "add") {
        const newCountry = {
          countryName: countryName,
          // conColor: iconColor,
        };
        await addCountry({ newCountry }).unwrap();
      } else {
        const updatedCountry = { countryName: countryName };
        await updateCountry({
          id: currentCountry._id,
          updatedCountry,
        }).unwrap();
      }

      setShowModal(false);
      refetch();
    } catch (err) {
      Toastify(err?.message || "error occured", "warn");
      console.error("Error saving country:", error);
    }
  };

  const colorOptions = [
    "bg-blue-400",
    "bg-gray-700",
    "bg-orange-700",
    "bg-green-600",
    "bg-purple-600",
    "bg-red-600",
  ];

  const toggleDropdown = (countryId) => {
    setShowDropdown(showDropdown === countryId ? null : countryId);
  };

  if (isLoading) {
    return <div className="p-6">Loading countries...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading countries: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Countries ({countries.length})</h1>
        {userRole.toLowerCase() === 'admin' &&
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
          onClick={handleAddCountry}
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
          Add Country
        </button>}
      </div>

      {countries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No countries found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries &&
            countries.length > 0 &&
            countries.map((country, index) => (
              <div
                key={country._id}
                className="border border-gray-200 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <span className="mr-4 text-gray-500">{index + 1}</span>
                    <span className="ml-4 text-lg font-medium">
                      {country.countryName}
                    </span>
                  </div>
                  {userRole.toLowerCase() === 'admin' &&
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => toggleDropdown(country._id)}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                    {showDropdown === country._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      >
                        <ul>
                          <li>
                            <button
                              onClick={() => handleEditCountry(country)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              Update
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDeleteCountry(country._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal for Add/Edit Country */}
      {userRole.toLowerCase() === 'admin' &&
      showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {actionType === "add" ? "Add New Country" : "Update Country"}
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
                htmlFor="countryName"
              >
                Country Name
              </label>
              <input
                id="countryName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter country name"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
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
                  ? "Add Country"
                  : "Update Country"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
