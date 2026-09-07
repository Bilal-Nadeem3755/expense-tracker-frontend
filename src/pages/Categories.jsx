import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Tags,
  X,
  RefreshCw,
  AlertCircle,
  TriangleAlert,
} from "lucide-react";

import api from "../services/api";

const Categories = () => {
  // ==========================================
  // State
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  const [editingCategory, setEditingCategory] = useState(null);

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [deleteError, setDeleteError] = useState("");

  // ==========================================
  // Get Categories
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories/");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);

      setError(error.response?.data?.detail || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Categories
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // Close Modal With Escape
  // ==========================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (categoryToDelete) {
          setCategoryToDelete(null);
          setDeleteError("");
        } else if (isModalOpen && !saving) {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, saving, categoryToDelete]);

  // ==========================================
  // Open Add Modal
  // ==========================================

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setError("");
    setIsModalOpen(true);
  };

  // ==========================================
  // Open Edit Modal
  // ==========================================

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setError("");
    setIsModalOpen(true);
  };

  // ==========================================
  // Close Modal
  // ==========================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setError("");
  };

  // ==========================================
  // Create / Update Category
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = categoryName.trim();

    // ==========================================
    // Required Validation
    // ==========================================

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    // ==========================================
    // Duplicate Category Validation
    // ==========================================

    const categoryExists = categories.some((category) => {
      const existingName = String(category.name || "")
        .trim()
        .toLowerCase();

      const newName = trimmedName.toLowerCase();

      // While editing, ignore the current category
      if (editingCategory && category.id === editingCategory.id) {
        return false;
      }

      return existingName === newName;
    });

    if (categoryExists) {
      setError("Category already exists.");
      return;
    }

    // ==========================================
    // Save Category
    // ==========================================

    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        // --------------------------------------
        // Update
        // --------------------------------------

        const response = await api.put(`/categories/${editingCategory.id}`, {
          name: trimmedName,
        });

        setCategories((previousCategories) =>
          previousCategories.map((category) =>
            category.id === editingCategory.id ? response.data : category,
          ),
        );
      } else {
        // --------------------------------------
        // Create
        // --------------------------------------

        const response = await api.post("/categories/", {
          name: trimmedName,
        });

        setCategories((previousCategories) => [
          ...previousCategories,
          response.data,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);

      setError(error.response?.data?.detail || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };
  // ==========================================
  // Open Delete Confirmation
  // ==========================================

  const openDeleteConfirmation = (category) => {
    setDeleteError("");
    setCategoryToDelete(category);
  };

  // ==========================================
  // Close Delete Confirmation
  // ==========================================

  const closeDeleteConfirmation = () => {
    if (deletingId) {
      return;
    }

    setCategoryToDelete(null);
    setDeleteError("");
  };

  // ==========================================
  // Delete Category
  // ==========================================

  const handleDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      setDeletingId(categoryToDelete.id);
      setDeleteError("");

      await api.delete(`/categories/${categoryToDelete.id}`);

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) => category.id !== categoryToDelete.id,
        ),
      );

      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);

      setDeleteError(
        error.response?.data?.detail || "Failed to delete category.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your expense and income categories.
          </p>
        </div>

        {/* ==================================== */}
        {/* Add Category - Only Show If Categories Exist */}
        {/* ==================================== */}

        {categories.length > 0 && (
          <button
            onClick={openAddModal}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <Plus size={18} />
            Add Category
          </button>
        )}
      </div>

      {/* ====================================== */}
      {/* Page Error */}
      {/* ====================================== */}

      {error && !isModalOpen && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
          "
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />

          <div className="min-w-0">
            <p className="text-sm font-medium text-red-700">
              Something went wrong
            </p>

            <p className="mt-0.5 text-xs text-red-600">{error}</p>
          </div>

          <button
            onClick={fetchCategories}
            className="
              ml-auto
              shrink-0
              rounded-lg
              px-2.5
              py-1.5
              text-xs
              font-medium
              text-red-700
              transition
              hover:bg-red-100
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* ====================================== */}
      {/* Loading */}
      {/* ====================================== */}

      {loading ? (
        <div
          className="
            flex
            min-h-80
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-700">
              Loading categories...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fetching your categories.
            </p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        /* ================================== */
        /* Empty State */
        /* ================================== */

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-5
            py-14
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-blue-600
            "
          >
            <Tags size={25} />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            No categories yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Create your first category to organize your transactions.
          </p>

          {/* ================================== */}
          {/* Empty State Add Button */}
          {/* ================================== */}

          <button
            onClick={openAddModal}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      ) : (
        /* ================================== */
        /* Categories Section */
        /* ================================== */

        <div>
          {/* Category Count */}

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Your Categories
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </p>
            </div>
          </div>

          {/* Categories Grid */}

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-100
                      text-blue-600
                    "
                  >
                    <Tags size={20} />
                  </div>

                  {/* Actions */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      opacity-100
                      sm:opacity-0
                      sm:transition
                      sm:group-hover:opacity-100
                    "
                  >
                    {/* Edit */}

                    <button
                      onClick={() => openEditModal(category)}
                      className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-blue-600
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-200
                      "
                      title="Edit category"
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}

                    <button
                      onClick={() => openDeleteConfirmation(category)}
                      className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-200
                      "
                      title="Delete category"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Category Name */}

                <h2
                  className="
                    mt-4
                    truncate
                    text-base
                    font-semibold
                    text-slate-900
                  "
                  title={category.name}
                >
                  {category.name}
                </h2>

                <p className="mt-1 text-xs text-slate-400">Category</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* Add / Edit Category Modal */}
      {/* ====================================== */}

      {isModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-100
            flex
            items-center
            justify-center
            bg-slate-950/40
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-xl
            "
          >
            {/* Modal Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                px-5
                py-4
              "
            >
              <div>
                <h2 className="font-semibold text-slate-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingCategory
                    ? "Update your category name."
                    : "Create a new category."}
                </p>
              </div>

              {/* Close */}

              <button
                onClick={closeModal}
                disabled={saving}
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="p-5">
              <label
                htmlFor="category-name"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Category Name
              </label>

              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="e.g. Food, Shopping, Bills"
                disabled={saving}
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
                autoFocus
              />

              {/* Modal Error */}

              {error && (
                <div className="mt-2 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />

                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}

              {/* Buttons */}

              <div className="mt-6 flex justify-end gap-3">
                {/* Cancel */}

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-lg
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                {/* Create / Update */}

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >
                  {saving && <RefreshCw size={16} className="animate-spin" />}

                  {saving
                    ? editingCategory
                      ? "Updating..."
                      : "Creating..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* Delete Confirmation Modal */}
      {/* ====================================== */}

      {categoryToDelete && (
        <div
          className="
            fixed
            inset-0
            z-110
            flex
            items-center
            justify-center
            bg-slate-950/40
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteConfirmation();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-sm
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-xl
            "
          >
            {/* Delete Header */}

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    text-red-600
                  "
                >
                  <TriangleAlert size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">
                    Delete category?
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-slate-700">
                      "{categoryToDelete.name}"
                    </span>
                    ?
                  </p>
                </div>

                <button
                  onClick={closeDeleteConfirmation}
                  disabled={Boolean(deletingId)}
                  className="
                    ml-auto
                    shrink-0
                    rounded-lg
                    p-1.5
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Warning */}

              <div
                className="
                  mt-4
                  rounded-lg
                  border
                  border-amber-200
                  bg-amber-50
                  px-3
                  py-2.5
                "
              >
                <p className="text-xs leading-5 text-amber-700">
                  This action cannot be undone.
                </p>
              </div>

              {/* Delete Error */}

              {deleteError && (
                <div
                  className="
                    mt-3
                    flex
                    items-start
                    gap-2
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-3
                    py-2.5
                  "
                >
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-xs leading-5 text-red-600">
                    {deleteError}
                  </p>
                </div>
              )}

              {/* Buttons */}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteConfirmation}
                  disabled={Boolean(deletingId)}
                  className="
                    rounded-lg
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={Boolean(deletingId)}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >
                  {deletingId ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Categories;
