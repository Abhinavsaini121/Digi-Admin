import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit3, X, AlertTriangle, Loader2 } from "lucide-react";
// API functions import
import {
    getAllCategories,
    addSubCategory,
    deleteSubCategoryAPI,
    updateCategoryAPI, getSubCategoriesByCategory
} from "../../auth/adminLogin";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SubCategories = () => {
    // States
    const [categories, setCategories] = useState([]); // Dropdown के लिए
    const [subCategories, setSubCategories] = useState([]); // Table के लिए
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    // Form States
    const [formData, setFormData] = useState({ category: "", name: "" });
    const [editData, setEditData] = useState({ id: "", category: "", name: "", oldName: "" });
    const [selectedSub, setSelectedSub] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCategories();
            if (response.success) {
                setCategories(response.data);

                // Agar koi category pehle se selected nahi hai (refresh ke waqt), 
                // toh pehli wali load karein
                const defaultCat = response.data[0]?.name || response.data[0];
                if (defaultCat && !selectedCategory) {
                    setSelectedCategory(defaultCat);
                    loadSubCategories(defaultCat);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSubCategories = async (catName) => {
        try {
            const response = await getSubCategoriesByCategory(catName);
            if (response.success) {
                // Array of strings ko table format mein convert karna
                const formattedSubs = response.data.map((subName, index) => ({
                    id: `${catName}-${index}`,
                    category: catName,
                    name: subName,
                    status: "Active"
                }));
                setSubCategories(formattedSubs);
            }
        } catch (error) {
            console.error("Error:", error);
            setSubCategories([]); // Error aane par table khali kar dein
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await addSubCategory(formData.category, formData.name);
            if (response.success) {
                setSelectedCategory(formData.category); // UI ko batayein ki hum ab is category mein hain
                await loadSubCategories(formData.category);
                setIsModalOpen(false);
                setFormData({ category: "", name: "" });
                toast.success("Sub-category added successfully!");
            }
        } catch (error) {
            alert(error.message || "Failed to add");
        } finally {
            setLoading(false);
        }
    };

    // 3. अपडेट (Update Subcategory)
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await updateCategoryAPI(editData.id, editData.category, editData.name);
            if (response.success) {
                toast.success("Sub-category updated successfully!"); setIsEditModalOpen(false);
                await fetchCategories();
                toast.success("Sub-category deleted successfully!");
            }
        } catch (error) {
            alert(error.message || "Update Failed");
        } finally {
            setLoading(false);
        }
    };

    // 4. डिलीट (Delete Subcategory)
    const confirmDelete = async () => {
        if (!selectedSub) return;
        try {
            setLoading(true);
            const response = await deleteSubCategoryAPI(selectedSub.category, selectedSub.name);
            if (response.success) {
                setIsDeleteModalOpen(false);

                await loadSubCategories(selectedSub.category);

                setSelectedSub(null);
                await fetchCategories();
            }
        } catch (error) {
            toast.error("Delete Failed!");
        } finally {
            setLoading(false);
        }
    };

    // Modal Helpers
    const openEditModal = (item) => {
        setEditData({
            id: item.parentId,
            category: item.category,
            name: item.name
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sub Categories</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                >
                    <PlusCircle size={18} /> Add Subcategory
                </button>
            </div>
            <div className="mb-4 flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">                <label className="font-semibold text-gray-700">View Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        loadSubCategories(e.target.value);
                    }}
                    className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map((cat, index) => (
                        <option key={index} value={cat.name || cat}>
                            {cat.name || cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">                <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                    <tr>
                        <th className="p-4 border-b">Category</th>
                        <th className="p-4 border-b">Subcategory Name</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {subCategories.length > 0 ? (
                        subCategories.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-700">{item.category}</td>
                                <td className="p-4 text-gray-600">{item.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => openEditModal(item)} className="text-amber-500 hover:bg-amber-50 p-1.5 rounded-lg">
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={() => { setSelectedSub(item); setIsDeleteModalOpen(true); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-10 text-center text-gray-400">
                                No subcategories found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>

            {/* --- CREATE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white p-6 rounded-2xl relative z-10 w-full max-w-md shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X size={20} /></button>
                        <h3 className="text-xl font-bold mb-6">Add New Subcategory</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => {
                                        setFormData({ ...formData, category: e.target.value });
                                        loadSubCategories(e.target.value);
                                    }}
                                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">Choose a category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat.name || cat}>
                                            {cat.name || cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter subcategory name"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Create Subcategory"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- UPDATE MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="bg-white p-6 rounded-2xl relative z-10 w-full max-w-md shadow-2xl">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X size={20} /></button>
                        <h3 className="text-xl font-bold mb-6">Update Subcategory</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Parent Category</label>
                                <input type="text" value={editData.category} disabled className="w-full border p-2.5 rounded-lg bg-gray-100 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Sub-category Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Update Subcategory"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="bg-white p-8 rounded-3xl relative z-10 w-full max-w-sm text-center shadow-2xl">
                        <AlertTriangle size={48} className="text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Are you sure?</h3>
                        <p className="mb-8 text-gray-500">Do you want to delete "{selectedSub?.name}" from {selectedSub?.category}?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 border p-3 rounded-xl hover:bg-gray-50">Cancel</button>
                            <button onClick={confirmDelete} disabled={loading} className="flex-1 bg-red-600 text-white p-3 rounded-xl hover:bg-red-700">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default SubCategories;