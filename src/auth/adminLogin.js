import apiClient from './apiClient';

// --- Login ---
export const adminLogin = async (email, password) => {
    try {
        const response = await apiClient.post('/admin/login', { email, password });
        if (response.data.token) { 
            localStorage.setItem("token", response.data.token);
        }
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Dashboard Stats ---
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard-stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// --- Get All Jobs ---
export const getAllJobs = async () => {
    try {
        // Usually fetch GET hota hai, agar aapka backend POST mangta hai to ise .post karein
        const response = await apiClient.get("/admin/part-time/jobs"); 
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Get Job By ID (Fetch Single) ---
export const getJobById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/part-time/job/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- UPDATE JOB (Corrected URL) ---
export const updateJob = async (id, jobData) => {
    try {
        
        const response = await apiClient.put(`/admin/part-time/job/update/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};