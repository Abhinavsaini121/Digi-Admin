

import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Trash2, Edit3, X, AlertTriangle, Loader2 } from "lucide-react";
import {
    addSubCategory,
    deleteSubCategoryAPI,
    updateCategoryAPI,
    updateSubCategoryAPI,
    getSubCategoriesByCategory,
    getCategoriesForDropdownAPI,
} from "../../auth/adminLogin";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";
const SubCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({ category: "", name: "" });
    const [editData, setEditData] = useState({ id: "", category: "", name: "" });
    const [selectedSub, setSelectedSub] = useState(null);

    // 1. Fetch Categories (Simple Array of Strings mapping)
    const fetchCategories = async () => {
        try {
            const response = await getCategoriesForDropdownAPI();
            if (response.success && response.data) {
                setCategories(response.data); // ["Chemistry", "Cleaning"...]

                if (response.data.length > 0) {
                    const first = response.data[0];
                    setSelectedCategory(first);
                    loadSubCategories(first);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 2. Load Subcategories based on selection
    const loadSubCategories = useCallback(async (catName) => {
        if (!catName) return;

        try {
            setLoading(true);

            const response = await getSubCategoriesByCategory(catName);

            // 🔥 IMPORTANT FIX HERE
            if (Array.isArray(response) && response.length > 0) {
                const formattedSubs = response.map((subName, index) => ({
                    id: `${catName}-${index}`,
                    category: catName,
                    name: subName,
                    status: "Active"
                }));

                setSubCategories(formattedSubs);
            } else {
                setSubCategories([]);
            }

        } catch (error) {
            console.error(error);
            setSubCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await addSubCategory(formData.category, formData.name);
            if (response.success) {
                toast.success("Sub-category added!");
                setIsModalOpen(false);
                setFormData({ category: "", name: "" });
                setSelectedCategory(formData.category);
                loadSubCategories(formData.category);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await deleteSubCategoryAPI(selectedSub.category, selectedSub.name);
            if (response.success) {
                toast.success("Deleted!");
                setIsDeleteModalOpen(false);
                loadSubCategories(selectedSub.category);
            }
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Mapping fields to your requested JSON structure
            const response = await updateSubCategoryAPI(
                editData.category,
                editData.oldSubCategory,
                editData.newSubCategory
            );
            if (response.success) {
                toast.success("Updated successfully!");
                setIsEditModalOpen(false);
                loadSubCategories(editData.category);
            }
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sub Categories</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <PlusCircle size={18} /> Add Subcategory
                </button>
            </div>

            {/* View Filter Dropdown - FIXED FOR STRING ARRAY */}
            <div className="mb-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="font-semibold text-gray-700">View Category:</label>
                <Select
                    options={categories.map(cat => ({ label: cat, value: cat }))}
                    value={selectedCategory ? { label: selectedCategory, value: selectedCategory } : null}
                    onChange={(selected) => {
                        const value = selected.value;

                        setSelectedCategory(value);
                        setFormData({ category: value, name: formData.name });

                        loadSubCategories(value);
                    }}
                    placeholder="Choose a category"
                    menuPlacement="auto"

                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                            <th className="p-4">Category</th>
                            <th className="p-4">Subcategory Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="4" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
                        ) : subCategories.length > 0 ? (
                            subCategories.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-4 font-medium">{item.category}</td>
                                    <td className="p-4 text-gray-600">{item.name}</td>
                                    <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Active</span></td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditData({
                                                        category: item.category,
                                                        oldSubCategory: item.name,
                                                        newSubCategory: item.name
                                                    });
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="text-amber-500 p-2"
                                            >
                                                <Edit3 size={18} />
                                            </button>                                            <button onClick={() => { setSelectedSub(item); setIsDeleteModalOpen(true); }} className="text-red-500 p-2"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-10 text-center text-gray-400">No data found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Adding */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[1.5rem] w-full max-w-md relative shadow-2xl overflow-hidden">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400"><X size={24} /></button>
                        <h3 className="text-2xl font-black mb-8">Add New Subcategory</h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Select Category</label>
                                <Select
                                    options={categories.map(cat => ({ label: cat, value: cat }))}
                                    value={
                                        selectedCategory
                                            ? { label: selectedCategory, value: selectedCategory }
                                            : null
                                    }
                                    onChange={(selected) => {
                                        const value = selected.value;

                                        setFormData({ ...formData, category: value });
                                        setSelectedCategory(value);
                                    }} placeholder="Choose a category"
                                    menuPlacement="auto"
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Subcategory Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subcategory name"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Create Subcategory"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[1.5rem] w-full max-w-md relative shadow-2xl">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-5 right-5 text-gray-400"><X size={24} /></button>
                        <h3 className="text-2xl font-black mb-8">Edit Subcategory</h3>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Category (Read Only)</label>
                                <input type="text" value={editData.category} disabled className="w-full border p-3.5 rounded-xl bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Old Subcategory Name</label>
                                <input type="text" value={editData.oldSubCategory} disabled className="w-full border p-3.5 rounded-xl bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">New Subcategory Name</label>
                                <input
                                    type="text"
                                    value={editData.newSubCategory}
                                    onChange={(e) => setEditData({ ...editData, newSubCategory: e.target.value })}
                                    className="w-full border p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Update Subcategory"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl text-center">

                        <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />

                        <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
                        <p className="text-gray-500 mb-6">Do you really want to delete this subcategory?</p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default SubCategories;