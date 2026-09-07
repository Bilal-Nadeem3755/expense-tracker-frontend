import api from "./api";


// ==========================================
// Get All Categories
// ==========================================

export const getCategories = async () => {
  const response = await api.get("/categories/");

  return response.data;
};


// ==========================================
// Create Category
// ==========================================

export const createCategory = async (categoryData) => {
  const response = await api.post(
    "/categories/",
    categoryData
  );

  return response.data;
};


// ==========================================
// Update Category
// ==========================================

export const updateCategory = async (
  categoryId,
  categoryData
) => {
  const response = await api.put(
    `/categories/${categoryId}`,
    categoryData
  );

  return response.data;
};


// ==========================================
// Delete Category
// ==========================================

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(
    `/categories/${categoryId}`
  );

  return response.data;
};