import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit3, X } from "lucide-react";
import { getAllCategories, createSubCategory } from "../../auth/adminLogin";

const SubCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ category: "", name: "" });

    // ✅ Fetch Categories (correct hook usage)
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.category) return;

        try {
            const response = await createSubCategory(formData.category, formData.name);

            if (response.success) {
                fetchCategories(); // refresh

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
        setSubCategories(
            subCategories.map((item) =>
                item.id === id
                    ? { ...item, status: item.status === "Active" ? "Disabled" : "Active" }
                    : item
            )
        );
    };

    const displayRows = subCategories;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sub Categories</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <PlusCircle size={18} /> Add Subcategory
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs">
                        <tr>
                            <th className="p-4">Category</th>
                            <th className="p-4">Subcategory Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayRows.map((item) => (
                            <tr key={item.id}>
                                <td className="p-4">{item.category}</td>
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">{item.status}</td>
                                <td className="p-4 text-right flex justify-end gap-3">
                                    <button className="text-amber-500">
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        className="text-red-500"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
           {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
        />

        <div className="bg-white p-6 rounded-xl relative z-10 w-full max-w-md border-2 border-blue-900 shadow-2xl">
            <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
                <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">Create Subcategory</h3>

            <form onSubmit={handleSave} className="space-y-4">
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="name"
                    placeholder="Subcategory Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                >
                    Save
                </button>
            </form>
        </div>
    </div>
)}
        </div>
    );
};

export default SubCategories;