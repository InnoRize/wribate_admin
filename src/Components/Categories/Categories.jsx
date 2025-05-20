import { useEffect, useState, useRef } from "react";
import Toastify from "../../utils/Toast";

import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../app/services/authApi";
import Swal from "sweetalert2";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  //const [iconColor, setIconColor] = useState("bg-blue-400");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [actionType, setActionType] = useState("add"); // "add" or "update"
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const { data, isLoading, error, refetch } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  useEffect(() => {
    if (data && data.catgories) {
      // Sort categories by name
      const categories = [...data.catgories]
      setCategories(categories.sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
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

  const handleAddCategory = () => {
    setActionType("add");
    setCategoryName("");
    //setIconColor("bg-blue-400");
    setCurrentCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setActionType("update");
    setCategoryName(category.categoryName);
    //setIconColor(category.iconColor);
    setCurrentCategory(category);
    setShowModal(true);
    setShowDropdown(null);
  };

  const handleDeleteCategory = (categoryId) => {
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
        deleteCategory(categoryId)
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "Your category has been deleted.", "success");
            refetch();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the category.",
              "error"
            );
            console.error("Error deleting category:", error);
          });
      }
    });
    setShowDropdown(null);
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      return;
    }

    try {
      if (actionType === "add") {
        const newCategory = {
          categoryName: categoryName,
          // conColor: iconColor,
        };
        await addCategory({ newCategory }).unwrap();
      } else {
        const updatedCategory = { categoryName: categoryName };
        await updateCategory({
          id: currentCategory._id,
          updatedCategory,
        }).unwrap();
      }

      setShowModal(false);
      refetch();
    } catch (err) {
      Toastify(err?.message || "error occured", "warn");
      console.error("Error saving category:", error);
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

  const toggleDropdown = (categoryId) => {
    setShowDropdown(showDropdown === categoryId ? null : categoryId);
  };

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading categories: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories ({categories.length})</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
          onClick={handleAddCategory}
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
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <div
                key={category._id}
                className="border border-gray-200 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <span className="mr-4 text-gray-500">{index + 1}</span>
                    {/* <div
                    className={`w-10 h-10 rounded-full ${category.iconColor} flex items-center justify-center overflow-hidden`}
                  >
                    {category.iconColor === "bg-blue-400" && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    )}
                    {category.iconColor === "bg-gray-700" && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.32 2.265c-5.52 0-10 4.48-10 10s4.48 10 10 10c5.51 0 10-4.48 10-10s-4.49-10-10-10zm2.99 14.99l-3.33-3.33v-5.66h2v4.95l2.94 2.94-1.61 1.1z" />
                      </svg>
                    )}
                    {category.iconColor === "bg-orange-700" && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                      </svg>
                    )}
                    {category.iconColor === "bg-green-600" && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                      </svg>
                    )}
                    {category.iconColor === "bg-purple-600" && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.5.51-.86.97-1.04 1.69-.08.32-.13.68-.13 1.14h-2v-.5c0-.46.08-.9.22-1.31.2-.58.53-1.1.95-1.52l1.24-1.26c.46-.44.68-1.1.55-1.8-.13-.72-.69-1.33-1.39-1.53-1.11-.31-2.14.32-2.47 1.27-.12.35-.05 1.43-.05 1.43h-2c-.01-2.21 1.73-4 3.89-4 1.37 0 2.56.73 3.25 1.81.71 1.13.7 2.3.01 3.28-.27.38-.78.93-.93 1.31-.16.33-.18.73-.18 1.11v.03z" />
                      </svg>
                    )}
                    {category.iconColor === "bg-red-600" && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z" />
                      </svg>
                    )}
                  </div> */}
                    <span className="ml-4 text-lg font-medium">
                      {category.categoryName}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => toggleDropdown(category._id)}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                    {showDropdown === category._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      >
                        <ul>
                          <li>
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              Update
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
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

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {actionType === "add" ? "Add New Category" : "Update Category"}
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
                htmlFor="categoryName"
              >
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            {/* <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Icon Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color} ${
                      iconColor === color
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setIconColor(color)}
                  ></button>
                ))}
              </div>
            </div> */}

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
                  ? "Add Category"
                  : "Update Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
