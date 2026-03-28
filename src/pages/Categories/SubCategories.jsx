

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit3, X } from "lucide-react";
// Apne file path ke hisab se import sahi karein
// Change this line
import { getAllCategories, createSubCategory } from "../../auth/adminLogin";
const SubCategories = () => {
    const [categories, setCategories] = useState([]); // API categories ke liye
    const [subCategories, setSubCategories] = useState([
        { id: 1, category: "Home Services", name: "Plumbing", status: "Active" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ category: "", name: "" });
    const displayRows = categories;

    // 1. API se Categories fetch karna
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        useEffect(() => {
            fetchCategories();
        }, []);
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.category) return;

        try {
            // API Call: createSubCategory(CategoryName, SubCategoryName)
            const response = await createSubCategory(formData.category, formData.name);

            if (response.success) {
                // Success hone par data refresh karein taaki table update ho jaye
                fetchCategories();

                // Modal band aur form reset karein
                setIsModalOpen(false);
                setFormData({ category: "", name: "" });
                alert("Sub-category added successfully!");
            }
        } catch (error) {
            console.error("Error saving subcategory:", error);
            alert(error.message || "Something went wrong");
        }
    };
    const handleDelete = (id) => {
        setSubCategories(subCategories.filter((item) => item.id !== id));
    };

    const toggleStatus = (id) => {
        setSubCategories(subCategories.map(item =>
            item.id === id ? { ...item, status: item.status === "Active" ? "Disabled" : "Active" } : item
        ));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sub Categories</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                >
                    <PlusCircle size={18} /> Add Subcategory
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Category</th>
                            <th className="p-4">Subcategory Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayRows.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{item.categoryName}</td>
                                <td className="p-4 text-gray-600">{item.subName}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-3">
                                    {/* Delete aur Status toggle ke liye alag API lagegi */}
                                    <button className="text-amber-500 hover:text-amber-600"><Edit3 size={18} /></button>
                                    <button className="text-red-500 hover:text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- BLUR MODAL SECTION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Background Blur Overlay */}
                    <div
                        className="absolute inset-0 backdrop-blur-md bg-white/30"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,139,0.25)] w-full max-w-md p-8 relative z-10 border-2 border-blue-900 animate-in fade-in zoom-in duration-300">                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>

                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Create Subcategory</h3>

                        <form onSubmit={handleSave} className="space-y-5">
                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Click to choose --</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory Name Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter name (e.g. AC Service)"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-2 border-blue-900/70 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-blue-900 focus:bg-white outline-none transition-all shadow-sm" />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubCategories;