
import apiClient from './apiClient';

// --- Login ---
export const adminLogin = async (email, password) => {
    try {
        const response = await apiClient.post('/admin/login', { email, password });
          
        console.log("login success", response);
                    
        if (response.data.token) { 
            localStorage.setItem("token", response.data.token);
            if (response.data.userId) { 
                localStorage.setItem("userId", response.data.userId); 
            }
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

// --- Get All Jobs (Part-Time) ---
export const getAllJobs = async () => {
    try {
        const response = await apiClient.get("/admin/part-time/jobs"); 
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Get Job By ID (Part-Time) ---
export const getJobById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/part-time/job/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- UPDATE JOB (Part-Time) ---
export const updateJob = async (id, jobData) => {
    try {
        // Payload mein adminId add kar sakte hain agar backend require karta hai
        const adminId = localStorage.getItem("id");
        const finalData = { ...jobData, updatedBy: adminId };
        
        const response = await apiClient.put(`/admin/part-time/job/update/${id}`, finalData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- DELETE JOB (Part-Time) ---
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
        const adminId = localStorage.getItem("id");
        const finalData = { ...jobData, createdBy: adminId };

        const response = await apiClient.post(`/admin/part-time/job/create`, finalData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Get All Full-Time Jobs ---
export const getAllFullTimeJobs = async () => {
    try {
        const response = await apiClient.get("/admin/full-time/all"); 
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error or Server Unreachable");
    }
};

export const addCategory = async (formData) => {
    // FormData ke case mein adminId aise append karte hain
    const adminId = localStorage.getItem("id");
    if(adminId) formData.append('adminId', adminId);

    const response = await apiClient.post("/admin/category/add", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getAllCategories = async () => {
    try {
        const response = await apiClient.get("/admin/category/all"); 
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Delete Category ---
export const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/admin/category/delete/${categoryId}`); 
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


// --- Get Pending Businesses ---
export const getPendingBusinesses = async () => {
  try {
    const response = await apiClient.get("/admin/business/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending businesses:", error);
    throw error;
  }
};

// --- Verify Business ---
export const verifyBusiness = async (id, action) => {
  try {
    const adminId = localStorage.getItem("id");
    const response = await apiClient.put(`/admin/business/verify/${id}`, { action, verifiedBy: adminId });
    return response.data;
  } catch (error) {
    console.error("Error verifying business:", error);
    throw error;
  }
};


export const createNewFullTimeJob = async (formData) => {
    try {
        const adminId = localStorage.getItem("id");
        if(adminId) formData.append('adminId', adminId);

        const response = await apiClient.post(`/admin/full-time/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error or Server Unreachable");
    }
};

// GET /api/admin/users
export const getAllUsersAPI = async () => {
    try {
        const response = await apiClient.get("/admin/users"); 
        return response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const updateUserStatusAPI = async (id, status) => {
    try {
        const adminId = localStorage.getItem("id");
        // Payload mein status ke sath adminId bhej rahe hain
        const response = await apiClient.patch(`/admin/user-status/${id}`, { status, adminId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const getAllBloodRequestsAPI = async () => {
    try {
        const response = await apiClient.get("/admin/blood-requests");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Update Blood Request (PUT) ---
export const updateBloodRequestAPI = async (id, requestData) => {
    try {
        const adminId = localStorage.getItem("id");
        const finalData = { ...requestData, updatedBy: adminId };
        
        const response = await apiClient.put(`/admin/blood-requests/${id}`, finalData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- Delete Blood Request (DELETE) ---
export const deleteBloodRequestAPI = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/blood-requests/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const getBloodRequestByIdAPI = async (id) => {
    try {
        const response = await apiClient.get(`/admin/blood-requests/${id}`);
        return response.data.data || response.data; 
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const createNewBloodRequestFromAdminAPI = async (requestDataWithUserId) => {
    try {
        const adminId = localStorage.getItem("id");
        const finalData = { ...requestDataWithUserId, adminId };
        const response = await apiClient.post('/admin/blood-requests', finalData); 
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const getAllAdminData = async () => {
try {
// Fetching data from the newly specified endpoint /api/admin/all
const response = await apiClient.get("/admin/all");
return response.data; 
}
catch (error) {
throw error.response ? error.response.data : new Error("Network Error");
}
};
// --- Modified Shop Management API Function ---

export const getAllShopsForAdmin = async () => {
    try {
        const response = await apiClient.get("/admin/manage-business/all"); 
        return response.data.data || response.data; 
    } catch (error) {
        console.error("Error fetching shops:", error);
        throw error.response ? error.response.data : new Error("Network Error or Shop Service Unreachable");
    }
};

export const getShopDetailsById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/manage-business/${id}`);
        
        return response.data.data || response.data; 
    } catch (error) {
        console.error(`Error fetching shop details for ID ${id}:`, error);
        throw error.response 
            ? error.response.data 
            : new Error("Network Error or Shop Details Service Unreachable");
    }
};

export const deletebusiness = async (id) => {
    try {
        const response = await apiClient.delete(`admin/manage-business/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const toggleBusinessStatusAPI = async (businessId, status) => {
    try {
        const adminId = localStorage.getItem("id");

      
        const response = await apiClient.patch(
            `/admin/manage-business/toggle-status/${businessId}`, 
            { status, adminId }
        );

        return response.data;
    } catch (error) {
      
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const createNewShopAPI = async (formData) => {
    try {
       
        const response = await apiClient.post("/admin/manage-business/create", formData, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error or Shop Creation Failed");
    }

};


export const createBusinessForUserAPI = async (formData) => {
    try {
        const response = await apiClient.post("/admin/manage-business/create-for-user", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const addServiceToBusinessAPI = async (businessId, formData) => {
    try {
        const response = await apiClient.post(`/admin/manage-business/add-service/${businessId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const getBusinessServicesAPI = async (businessId) => {
    try {
        const response = await apiClient.get(`/business/${businessId}/services`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};