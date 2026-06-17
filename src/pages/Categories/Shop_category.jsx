import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  PlusCircle,
  Eye,
  Layers,
  X,
} from "lucide-react";
import {
  getAllCategoriesAPI,
  createCategoryAPI,
  deleteCategoryAPI,
} from "../../auth/category";
import DeleteConfirmModal from "../../components/common/DeleteConfirm";
const CategoryShop = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    subCategory: "",
    status: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleDelete = (id) => {
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategoryAPI(selectedCategoryId);

      setCategories((prev) =>
        prev.filter((item) => item._id !== selectedCategoryId),
      );

      setIsDeleteModalOpen(false);
      setSelectedCategoryId(null);

      alert("Category Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert(error.message || "Failed to Delete Category");
    }
  };
  const handleEdit = (item) => {
    console.log(item);
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategoriesAPI();
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit Clicked");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("image", selectedImage);
      data.append("status", formData.status);

      const response = await createCategoryAPI(data);

      setCategories((prev) => [response.data, ...prev]);

      setIsModalOpen(false);

      setFormData({
        name: "",
        type: "",
        image: "",
        subCategory: "",
        status: true,
      });

      setSelectedImage(null);

      alert("Category Added Successfully");
    } catch (error) {
      console.log(error);
      alert(error.message || "Failed to Add Category");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-[#fafbfe] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Shop Categories
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Browse and manage active business shop categories and services
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 flex items-center gap-2"
        >
          <PlusCircle size={15} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md"
          >
            <div className="relative aspect-video bg-slate-50 overflow-hidden border-b border-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3">
                <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-slate-100">
                  <Layers size={10} className="text-indigo-500" />
                  {item.type}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                {item.status ? (
                  <span className="bg-emerald-500/95 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={10} className="fill-current" /> ACTIVE
                  </span>
                ) : (
                  <span className="bg-rose-500/95 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <XCircle size={10} className="fill-current" /> INACTIVE
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                  {item.name}
                </h2>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-2">
                    Services / Sub-Categories
                  </span>

                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {item.subCategory && item.subCategory.length > 0 ? (
                      item.subCategory.map((sub, index) => (
                        <span
                          key={index}
                          className="bg-indigo-50/50 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-indigo-100/30"
                        >
                          {sub}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic font-medium">
                        No Services Available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
                  <Eye size={13} />
                  View Details
                </button>

                <button
                  className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Add New Category
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Barber Shop"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Salon, Repair, Cleaning"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Upload Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <label
                  htmlFor="status"
                  className="text-xs font-semibold text-slate-600 select-none cursor-pointer"
                >
                  Mark as Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CategoryShop;
