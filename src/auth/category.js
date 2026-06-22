import apiClient from "./apiClient";

export const getAllCategoriesAPI = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      "/admin/category/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("GET ALL CATEGORIES ERROR:", error);

    throw error.response
      ? error.response.data
      : new Error("Network Error");
  }
};

export const createCategoryAPI = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(
      "/admin/category/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

export const deleteCategoryAPI = async (categoryId) => {
  try {
    const response = await apiClient.delete(
      `/admin/category/delete/${categoryId}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};


// --- UPDATE CATEGORY ---
export const updateCategoryAPI = async (categoryId, formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.put(
      `/admin/category/update/${categoryId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};
export const getAllSubCategoriesAPI = async (categoryId) => {
  try {
    const response = await apiClient.get(
      `/admin/category/get-allSubCategories/${categoryId}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};