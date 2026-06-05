import apiClient from "./apiClient";

export const getAllPlans = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/admin/plans?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Network Error");
  }
};

// --- DELETE PLAN ---
export const deletePlanAPI = async (planId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.delete(
      `/admin/delete-plan/${planId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("DELETE PLAN ERROR:", error);

    throw error.response
      ? error.response.data
      : new Error("Network Error");
  }
};

// --- UPDATE PLAN ---
export const updatePlanAPI = async (planId, planData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.put(
      `/admin/update-plan/${planId}`,
      planData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { success, message, data }
  } catch (error) {
    console.error("UPDATE PLAN ERROR:", error);

    throw error.response
      ? error.response.data
      : new Error("Network Error");
  }
};


// --- GET ALL COUPONS ---
export const getAllCouponsAPI = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      "/admin/coupon/admin/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // { success, data: [...] }
  } catch (error) {
    console.error("GET ALL COUPONS ERROR:", error);

    throw error.response
      ? error.response.data
      : new Error("Network Error");
  }
};

// --- CREATE COUPON ---
export const createCouponAPI = async (couponData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(
      "/admin/coupon/admin/create",
      couponData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { success, message, data }
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);

    throw error.response
      ? error.response.data
      : new Error("Network Error");
  }
};