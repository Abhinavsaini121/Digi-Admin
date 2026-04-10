
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
        // Returning response.data.data to directly access the stats object
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
        const adminId = localStorage.getItem("id");


        let dataToSend;
        if (jobData instanceof FormData) {
            dataToSend = jobData;

            if (adminId) dataToSend.append("updatedBy", adminId);
        } else {
            dataToSend = { ...jobData, updatedBy: adminId };
        }


        const response = await apiClient.put(`/admin/part-time/job/update/${id}`, dataToSend);
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


        if (jobData instanceof FormData) {

            if (adminId) {
                jobData.append("createdBy", adminId);
            }

            const response = await apiClient.post(`/admin/part-time/job/create`, jobData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } else {

            const finalData = { ...jobData, createdBy: adminId };
            const response = await apiClient.post(`/admin/part-time/job/create`, finalData);
            return response.data;
        }
    } catch (error) {
        console.error("API Error Details:", error);
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



export const getAllCategories = async () => {
    try {
        const response = await apiClient.get("/admin/category/all");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Network Error";
        throw new Error(errorMessage);
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
        if (adminId) formData.append('adminId', adminId);

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

export const updateBusinessDetailsAPI = async (businessId, formData) => {
    try {

        const response = await apiClient.put(`/admin/manage-business/update/${businessId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};



export const updateBusinessServiceAPI = async (businessId, serviceId, formData) => {
    try {
        const response = await apiClient.put(
            `/admin/manage-business/update-service/${businessId}/${serviceId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};


export const deleteBusinessServiceAPI = async (businessId, serviceId) => {
    try {
        const response = await apiClient.delete(
            `/admin/manage-business/delete-service/${businessId}/${serviceId}`
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
};



export const addCategory = async (formData) => {
    try {
        const adminId = localStorage.getItem("id") || localStorage.getItem("userId");

        // Agar image upload ho rahi hai (FormData use ho raha hai)
        if (formData instanceof FormData) {
            if (adminId) formData.append("createdBy", adminId);
            const response = await apiClient.post("/admin/category/add", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        }
        // Agar normal JSON data bhej rahe hain
        else {
            const finalData = { ...formData, createdBy: adminId };
            const response = await apiClient.post("/admin/category/add", finalData);
            return response.data;
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error or Category Creation Failed");
    }
};

// --- DELETE CATEGORY CONTROLLER ---
export const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem("token");

    const response = await apiClient.delete(
        `/admin/category/delete/${categoryId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const createSubCategory = async (categoryName, subCategoryName) => {
    try {
        // Payload as per your requirement
        const payload = {
            category: categoryName,
            subCategory: subCategoryName
        };

        const response = await apiClient.post("/admin/category/create-subCategory", payload);

        return response.data;
    } catch (error) {
        console.error("Error creating sub-category:", error);
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- DELETE SUB-CATEGORY ---
export const deleteSubCategoryAPI = async (categoryName, subCategoryName) => {
    try {
        const response = await apiClient.delete("/admin/category/delete-subCategory", {
            data: {
                category: categoryName,
                subCategoryToDelete: subCategoryName
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting sub-category:", error);
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- UPDATE CATEGORY ---
export const updateCategoryAPI = async (id, categoryName, subCategoryName) => {
    try {
        const adminId = localStorage.getItem("id") || localStorage.getItem("userId");

        // Payload जैसा आपने बताया: category और name
        const payload = {
            category: categoryName, // e.g. Electronics
            name: subCategoryName,   // e.g. MUSICS
            updatedBy: adminId
        };

        // URL: /admin/category/update/:id
        const response = await apiClient.put(`/admin/category/update/${id}`, payload);

        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


// --- Add Sub Category ---
export const addSubCategory = async (categoryName, subCategoryName) => {
    try {
        // Payload as per your requirement
        const payload = {
            category: categoryName,    // e.g., "electronics"
            subCategory: subCategoryName // e.g., "Laptops"
        };

        const response = await apiClient.post("/admin/category/create-subCategory", payload);

        // Success response logic
        return response.data;
    } catch (error) {
        // Error handling consistency check
        console.error("Error adding sub-category:", error);
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const getSubCategoriesByCategory = async (categoryName) => {
    try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get(`/admin/category/get-subCategories`, {
            params: { categoryName }, headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching sub-categories:", error);
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const getAllMasterUsers = async () => {
    try {
        const response = await apiClient.get("/admin/users/all-users");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error or Server Unreachable");
    }
};

export const updateUserProfileAPI = async (userId, userData) => {
    try {
        const adminId = localStorage.getItem("id") || localStorage.getItem("userId");

        let dataToSend;
        let headers = {};

        if (userData instanceof FormData) {
            dataToSend = userData;
            if (adminId) dataToSend.append("updatedBy", adminId);
            headers = { "Content-Type": "multipart/form-data" };
        } else {
            dataToSend = { ...userData, updatedBy: adminId };
        }

        const response = await apiClient.put(`/admin/users/update-profile/${userId}`, dataToSend, {
            headers: headers
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const deleteUserAPI = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/users/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const searchUsersAPI = async (name) => {
    try {
        const response = await apiClient.get("/admin/users/search", {
            params: { name }, // This will append ?name=... to the URL
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data; // Returns { status, message, data }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const registerAdmin = async (name, email, password) => {
    try {
        const response = await apiClient.post('/admin/register', {
            name,
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const searchAdminAPI = async (query) => {
    try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/admin/search-admin", {
            params: { query },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};


export const deleteAdminAPI = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await apiClient.delete(`/admin/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Expected: { "message": "Admin deleted successfully" }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

export const updateAdminAPI = async (id, adminData) => {
    try {
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("id") || localStorage.getItem("userId");

        // Including updatedBy for tracking, similar to your other update controllers
        const dataToSend = { ...adminData, updatedBy: adminId };

        const response = await apiClient.put(`/admin/update/${id}`, dataToSend, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Expected: { "message": "Admin updated successfully", "admin": {...} }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// --- SEARCH USERS BY NAME ---
export const searchUsersByNameAPI = async (name) => {
    try {
        const token = localStorage.getItem("token");

        const response = await apiClient.get("/admin/users/search", {
            params: { name }, // This adds ?name=Digi to the URL
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // This returns the { status, message, data: [...] } object
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};