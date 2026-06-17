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
  updateCategoryAPI,
} from "../../auth/category";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/common/DeleteConfirm";
const CategoryShop = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    status: true,
  });

  const [editImage, setEditImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    subCategory: "",
    status: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleView = (item) => {
    setSelectedCategory(item);
    setIsViewModalOpen(true);
  };
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

      toast.success("Category Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Delete Category");
    }
  };
  const handleEdit = (item) => {
    setEditData({
      _id: item._id,
      name: item.name,
      status: item.status,
    });

    setEditImage(null);
    setIsEditModalOpen(true);
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
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleUpdateCategory = async () => {
    try {
      const data = new FormData();

      data.append("name", editData.name);
      data.append("status", editData.status);

      if (editImage) {
        data.append("image", editImage);
      }

      const response = await updateCategoryAPI(editData._id, data);

      setCategories((prev) =>
        prev.map((item) => (item._id === editData._id ? response.data : item)),
      );

      setIsEditModalOpen(false);
      setEditImage(null);

      toast.success("Category Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Update Category");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit Clicked");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("type", "Business");
      data.append("image", selectedImage);
      data.append("status", formData.status);

      const response = await createCategoryAPI(data);

      setCategories((prev) => [response.data, ...prev]);

      setIsModalOpen(false);

      setFormData({
        name: "",
        image: "",
        subCategory: "",
        status: true,
      });

      setSelectedImage(null);

      toast.success("Category Added Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Add Category");
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
                <button
                  onClick={() => handleView(item)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Styled Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <PlusCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-wide">
                    Add New Category
                  </h3>
                  <p className="text-xs text-indigo-100 mt-0.5">
                    Create a new category for your shop services
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Category Name Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Barber Shop"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium placeholder-slate-400"
                />
              </div>

              {/* Upload Category Image Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Upload Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  required
                  className="block w-full text-xs text-slate-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-xl file:border-0
              file:text-xs file:font-bold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              border border-slate-200 rounded-xl p-1.5 cursor-pointer bg-white transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Custom Status Toggle Switch */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-xl transition-all duration-200 hover:bg-slate-100/50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Category Status
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Toggle visibility of this category
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Styled Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-wide">
                    Edit Category
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Update category details and status
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Category Name Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  placeholder="Enter category name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium placeholder-slate-400"
                />
              </div>

              {/* Upload New Image Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Upload New Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  className="block w-full text-xs text-slate-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-xl file:border-0
              file:text-xs file:font-bold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              border border-slate-200 rounded-xl p-1.5 cursor-pointer bg-white transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <p className="text-[10px] text-slate-400 font-semibold pl-1">
                  Leave blank to keep the current image
                </p>
              </div>

              {/* Custom Status Toggle Switch */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-xl transition-all duration-200 hover:bg-slate-100/50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Category Status
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Toggle visibility of this category
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={editData.status}
                    onChange={handleEditChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateCategory}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isViewModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold mb-4">Category Details</h2>

            <img
              src={selectedCategory.image}
              alt={selectedCategory.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {selectedCategory.name}
              </p>

              <p>
                <strong>Type:</strong> {selectedCategory.type}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedCategory.status ? "Active" : "Inactive"}
              </p>

              <div>
                <strong>Sub Categories:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategory.subCategory?.length > 0 ? (
                    selectedCategory.subCategory.map((sub, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 px-2 py-1 rounded text-xs"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span>No Sub Categories</span>
                  )}
                </div>
              </div>
            </div>
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
