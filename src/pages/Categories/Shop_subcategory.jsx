import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  PlusCircle,
  Eye,
  Layers,
  X,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getAllCategoriesAPI,
  getAllSubCategoriesAPI,
  createSubCategory,
  updateSubCategoryAPI,
  deleteSubCategory,
} from "../../auth/category";

const InlineDeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedItem,
  subCategoryList,
}) => {
  const [targetSub, setTargetSub] = useState(""); // Isse state manage hogi

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-custom-fade">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Confirm Delete
        </h3>

        {/* Category Name (Static) */}
        <p className="text-xs text-slate-500 mb-1">
          Category: {selectedItem?.name}
        </p>

        {/* Sub-Category Dropdown */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-500 block mb-2">
            Select Sub-Category to Delete
          </label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
            value={targetSub}
            onChange={(e) => setTargetSub(e.target.value)}
          >
            <option value="">Select Sub-category</option>
            {subCategoryList.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 py-2.5 rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(targetSub)} // Yahan selected value pass hogi
            disabled={!targetSub}
            className="flex-1 bg-rose-500 text-white py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
const SubCategoryShop = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubCategoryItem, setSelectedSubCategoryItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [deleteForm, setDeleteForm] = useState({
    categoryId: "",
    subCategory: "",
  });

  const [selectedDeleteSubCategory, setSelectedDeleteSubCategory] =
    useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategory: "",
  });
  const [formSubCategoryTags, setFormSubCategoryTags] = useState(["Cleaning"]);
  const [currentTagInput, setCurrentTagInput] = useState("");

  const [editData, setEditData] = useState({
    categoryId: "",
    oldSubCategory: "",
    newSubCategory: "",
  });
  const [editSubCategoryTags, setEditSubCategoryTags] = useState([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchCategories();
    setLoading(false);
  }, []);
  useEffect(() => {
    if (formData.categoryId) {
      fetchSubCategories();
    }
  }, [formData.categoryId]);
  const fetchSubCategories = async () => {
    try {
      setLoading(true);

      const response = await getAllSubCategoriesAPI(formData.categoryId);

      setSubCategories([
        {
          _id: formData.categoryId,
          name: response.categoryName,
          type: "Business",
          image: "https://via.placeholder.com/600x400",
          subCategory: response.subCategories || [],
          status: true,
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sub-categories");
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesAPI();
      setCategories(response.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleView = (item) => {
    setSelectedSubCategory(item);
    setIsViewModalOpen(true);
  };
  const handleDelete = (item) => {
    setSelectedSubCategoryItem(item);

    // Selected category ka data save hoga
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async (subCategoryName) => {
    try {
      await deleteSubCategory(selectedSubCategoryItem._id, subCategoryName);

      await fetchSubCategories();

      setIsDeleteModalOpen(false);
      setSelectedSubCategoryItem(null);
      toast.success("Sub-Category Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Delete Sub-Category");
    }
  };
  const handleEdit = (item) => {
    console.log("Item =>", item);
    console.log("SubCategories =>", item.subCategory);

    setEditData({
      categoryId: item._id,
      oldSubCategory: item.subCategory[0],
      newSubCategory: item.subCategory[0],
    });
    setEditSubCategoryTags(item.subCategory || []);
    setEditImage(null);
    setIsEditModalOpen(true);
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

  // Tag Add/Remove Handlers (Add Form)
  const addTag = () => {
    if (
      currentTagInput.trim() !== "" &&
      !formSubCategoryTags.includes(currentTagInput.trim())
    ) {
      setFormSubCategoryTags([...formSubCategoryTags, currentTagInput.trim()]);
      setCurrentTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setFormSubCategoryTags(
      formSubCategoryTags.filter((_, idx) => idx !== indexToRemove),
    );
  };

  // Tag Add/Remove Handlers (Edit Form)
  const addEditTag = () => {
    if (
      editTagInput.trim() !== "" &&
      !editSubCategoryTags.includes(editTagInput.trim())
    ) {
      setEditSubCategoryTags([...editSubCategoryTags, editTagInput.trim()]);
      setEditTagInput("");
    }
  };

  const removeEditTag = (indexToRemove) => {
    setEditSubCategoryTags(
      editSubCategoryTags.filter((_, idx) => idx !== indexToRemove),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createSubCategory(
        formData.categoryId,
        formData.subCategory,
      );
      setSubCategories((prev) => [response.data, ...prev]);
      setIsModalOpen(false);

      setFormData({
        categoryId: "",
        subCategory: "",
      });
      toast.success("Sub-Category Added Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Add Sub-Category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafbfe]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading Sub-Categories...
          </p>
        </div>
      </div>
    );
  }
  const handleUpdate = async () => {
    try {
      const payload = {
        categoryId: editData.categoryId,
        oldSubCategory: editData.oldSubCategory,
        newSubCategory: editData.newSubCategory,
      };

      const response = await updateSubCategoryAPI(payload);

      fetchSubCategories();

      setIsEditModalOpen(false);

      toast.success(response.message || "Sub-Category Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Update Sub-Category");
    }
  };
  return (
    <div className="p-4 md:p-8 bg-[#fafbfe] min-h-screen font-sans">
      {/* CSS Animation Overrides */}
      <style>{`
        @keyframes customFade {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-custom-fade {
          animation: customFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Sub-Categories Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Browse and construct subcategories mapped with specialized services
          </p>
          <div className="mt-4 w-72">
            <label className="block text-xs font-bold text-slate-500 mb-2">
              Choose Category Name
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                }));
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-48 overflow-y-auto"
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <select
            value="SUBCATEGORY"
            className="w-40 bg-white border border-slate-200 text-slate-600 rounded-xl px-3 py-2.5 text-xs font-semibold"
            onChange={(e) => {
              if (e.target.value === "CATEGORY") {
                navigate("/cat-shop");
              }
            }}
          >
            <option value="CATEGORY">Category</option>
            <option value="SUBCATEGORY">SubCategory</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle size={15} />
            Add Sub-Category
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((item) => (
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
                    Subcategories
                  </span>

                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {item.subCategory && item.subCategory.length > 0 ? (
                      item.subCategory.map((sub, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          #{sub}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic font-medium">
                        No sub-items active
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
                  View
                </button>

                <button
                  className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm flex items-center gap-1"
                  onClick={() => handleEdit(item)}
                >
                  <Edit2 size={12} /> Edit
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm flex items-center gap-1"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-custom-fade">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white relative flex-shrink-0">
              <button
                type="button"
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
                    New Sub-Category
                  </h3>
                  <p className="text-xs text-indigo-100 mt-0.5">
                    Map customized sub-categories and dynamic tag structures
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto max-h-[70vh]"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 max-h-48 overflow-y-auto"
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Sub-Category Name
                  </label>

                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Enter sub-category name"
                  />
                </div>
              </div>

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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-custom-fade">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Edit2 size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-wide">
                    Edit Sub-Category
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Alter mappings, types, or visual banners
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Old Sub-Category
                </label>

                <select
                  name="oldSubCategory"
                  value={editData.oldSubCategory}
                  onChange={handleEditChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3"
                >
                  {editSubCategoryTags.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  New Sub-Category
                </label>

                <input
                  type="text"
                  name="newSubCategory"
                  value={editData.newSubCategory}
                  onChange={handleEditChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3"
                  placeholder="Enter new sub-category name"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}
      {isViewModalOpen && selectedSubCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-custom-fade">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors bg-black/30 hover:bg-black/50 p-1.5 rounded-full z-10"
            >
              <X size={16} />
            </button>

            <div className="relative h-48 bg-slate-100">
              <img
                src={selectedSubCategory.image}
                alt={selectedSubCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                <div>
                  <span className="text-[9px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                    {selectedSubCategory.type}
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {selectedSubCategory.name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Status
                </span>
                {selectedSubCategory.status ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />{" "}
                    Active
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <XCircle size={12} className="text-rose-500" /> Inactive
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block mb-2">
                  Mapped Tags & Subcategories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubCategory.subCategory?.length > 0 ? (
                    selectedSubCategory.subCategory.map((sub, index) => (
                      <span
                        key={index}
                        className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-100"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      No subcategories listed
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition-all"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <InlineDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        selectedItem={selectedSubCategoryItem} // Yeh pehle se hai
        subCategoryList={selectedSubCategoryItem?.subCategory || []}
      />
    </div>
  );
};

export default SubCategoryShop;
