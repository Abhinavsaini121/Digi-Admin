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

// --- DELETE JOB ---
export const deleteJob = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/part-time/job/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const createNewJob = async (jobData) => {
    try {
        // Aapka apiClient ya axios instance yahan use hoga
        const response = await apiClient.post(`/admin/part-time/job/create`, jobData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Get All Full-Time Jobs ---
export const getAllFullTimeJobs = async () => {
    try {
        // API Endpoint: GET /admin/full-time/all 
        const response = await apiClient.get("/admin/full-time/all"); 
        
        // Response structure expected: { success: true, data: [...] }
        return response.data; 
    } catch (error) {
        // Throw an error with the response data (for better error messages in the component)
        throw error.response ? error.response.data : new Error("Network Error or Server Unreachable");
    }
};

export const addCategory = async (formData) => {
    // API Endpoint: POST /admin/category/add
    const response = await apiClient.post("/admin/category/add", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
// API Endpoint: GET /user/categories
export const getAllCategories = async () => {
    try {
        // GET request to fetch category list
        const response = await apiClient.get("/admin/category/all"); 
        return response.data; // Return fetched categories array
    } catch (error) {
        // Handle API error
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- NEW API Endpoint: DELETE /api/admin/category/delete/:id ---
export const deleteCategory = async (categoryId) => {
    try {
        // DELETE request to delete a category by ID
        const response = await apiClient.delete(`/admin/category/delete/${categoryId}`); 
        return response.data; 
    } catch (error) {
        // Handle API error
        throw error.response ? error.response.data : new Error("Network Error");
    }
};



// 1. Get Pending Businesses (GET)
export const getPendingBusinesses = async () => {
  try {
    // URL becomes: https://digiapp-node-1.onrender.com/api/admin/business/pending
    const response = await apiClient.get("/admin/business/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending businesses:", error);
    throw error;
  }
};
// 2. Verify/Approve/Reject Business (PUT)
export const verifyBusiness = async (id, action) => {
  try {
    // API: /api/admin/business/verify/{id}
    // Payload: { "action": "approve" } or { "action": "reject" }
    const response = await apiClient.put(`/admin/business/verify/${id}`, { action });
    return response.data;
  } catch (error) {
    console.error("Error verifying business:", error);
    throw error;
  }
};