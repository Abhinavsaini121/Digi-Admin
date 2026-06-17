import React, { useState, useEffect } from "react";
import {
  getAllLocalJobs,
  createLocalJob,
  deleteLocalJob,
  updateLocalJob,
} from "../../auth/adminLogin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LocalNeeds = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [jobType, setJobType] = useState("ADMIN");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllLocalJobs(page);
        setTasks(res.data || []);
        setPagination(res.pagination || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, [page]);

  const handlePostNewAPI = async (newTask, id) => {
    try {
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("details", newTask.details);
      formData.append("jobCategory", "LOCAL_JOB");
      formData.append("isFeatured", newTask.isFeatured);
      formData.append("workType", newTask.workType);
      formData.append("whatsappNumber", newTask.whatsappNumber);
      formData.append("budget[min]", newTask.budget.min);
      formData.append("budget[max]", newTask.budget.max);

      newTask.preferredCommunication.forEach((item) => {
        formData.append("preferredCommunication[]", item);
      });
      formData.append("location[type]", "Point");
      formData.append("location[coordinates][]", newTask.location.coordinates[0]);
      formData.append("location[coordinates][]", newTask.location.coordinates[1]);
      formData.append("location[address]", newTask.location.address);

      if (newTask.images) {
        formData.append("images", newTask.images);
      }

      let res;
      if (id) {
        res = await updateLocalJob(id, formData);
        setTasks((prev) =>
          prev.map((item) => (item._id === id ? res.data : item))
        );
        toast.success("Updated successfully", { autoClose: 4000 });
      } else {
        res = await createLocalJob(formData);
        setTasks((prev) => [res.data, ...prev]);
        toast.success("Posted successfully", { autoClose: 4000 });
      }
      setIsPostModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    setSelectedTaskId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLocalJob(selectedTaskId);
      setTasks((prev) => prev.filter((item) => item._id !== selectedTaskId));
      toast.success("Deleted successfully", { autoClose: 4000 });
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsPostModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mt-5 mb-6">
        <h1 className="text-2xl font-bold">Local Needs Management</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <select
              value={jobType}
              onChange={(e) => {
                const value = e.target.value;
                setJobType(value);
                if (value === "ADMIN") {
                  navigate("/needsManagement");
                } else if (value === "USER") {
                  navigate("/user-local");
                }
              }}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm font-medium transition duration-200 ease-in-out cursor-pointer appearance-none"
            >
              <option value="" disabled hidden>
                Select Type
              </option>
              <option value="ADMIN">Admin Panel</option>
              <option value="USER">User Panel</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedTask(null);
              setIsViewMode(false);
              setIsPostModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Post New Need
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Posted By</th>
                <th className="p-4">Role</th>
                <th className="p-4">Location</th>
                <th className="p-4">Work Type</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tasks.length > 0 ? (
                tasks.map((t, i) => (
                  <tr key={t._id || i} className="hover:bg-slate-50/80 transition duration-150 ease-in-out group">
                    <td className="p-4 text-center font-medium text-slate-400">
                      {(page - 1) * 10 + i + 1}
                    </td>
                    <td className="p-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-200">
                        {t.images?.[0] ? (
                          <img
                            src={t.images[0]}
                            alt={t.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {t.userId?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.userId?.role === "ADMIN" 
                          ? "bg-purple-50 text-purple-700 border border-purple-100" 
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {t.userId?.role || "USER"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      {t.location?.address || "No Address"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {t.workType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {t.whatsappNumber}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.status === "active" || t.status === "open"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        {t.status || "inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedTask(t);
                            setIsViewMode(true);
                            setIsPostModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition duration-150"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 rounded-lg transition duration-150"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 rounded-lg transition duration-150"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-400 font-medium">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Page {page} of {pagination.totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-700 font-semibold rounded-xl text-xs transition duration-150 shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            <button
              disabled={page === pagination.totalPages || !pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-700 font-semibold rounded-xl text-xs transition duration-150 shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isPostModalOpen && (
        <ThemedTaskModal
          initialData={selectedTask}
          onSave={handlePostNewAPI}
          isViewMode={isViewMode}
          onClose={() => {
            setIsPostModalOpen(false);
            setSelectedTask(null);
            setIsViewMode(false);
          }}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ThemedTaskModal = ({ onSave, onClose, initialData, isViewMode }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    workType: "",
    whatsappNumber: "",
    userName: "",
    userRole: "",
    budget: { min: "", max: "" },
    preferredCommunication: [],
    location: { type: "Point", coordinates: ["", ""], address: "" },
    images: null,
    isFeatured: false,
    status: "expired",
    expiresAt: "",
  });

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      title: initialData.title || "",
      details: initialData.details || "",
      workType: initialData.workType || "",
      whatsappNumber: initialData.whatsappNumber || "",
      userName: initialData.userId?.name || "N/A",
      userRole: initialData.userId?.role || "N/A",
      budget: {
        min: initialData.budget?.min || "",
        max: initialData.budget?.max || "",
      },
      preferredCommunication: initialData.preferredCommunication || [],
      location: {
        type: "Point",
        coordinates: initialData.location?.coordinates || ["", ""],
        address: initialData.location?.address || "",
      },
      images: null,
      isFeatured: initialData.isFeatured || false,
      status: initialData.status || "expired",
      expiresAt: initialData.expiresAt || "",
    });

    if (initialData.images?.length) {
      setPreviewImage(initialData.images[0]);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "images") {
      const file = files[0];
      setFormData({ ...formData, images: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else if (name.includes("location")) {
      const updatedLocation = { ...formData.location };
      if (name === "location.address") {
        updatedLocation.address = value;
      } else if (name === "location.coordinates[0]") {
        updatedLocation.coordinates[0] = value;
      } else if (name === "location.coordinates[1]") {
        updatedLocation.coordinates[1] = value;
      }
      setFormData({ ...formData, location: updatedLocation });
    } else if (name === "budget.min") {
      setFormData({
        ...formData,
        budget: { ...formData.budget, min: value },
      });
    } else if (name === "budget.max") {
      setFormData({
        ...formData,
        budget: { ...formData.budget, max: value },
      });
    } else if (name === "preferredCommunication") {
      const updated = formData.preferredCommunication.includes(value)
        ? formData.preferredCommunication.filter((v) => v !== value)
        : [...formData.preferredCommunication, value];
      setFormData({ ...formData, preferredCommunication: updated });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [longitude, latitude],
          },
        }));
      },
      (error) => {
        console.error(error);
        alert("Unable to fetch location");
      },
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.details ||
      !formData.workType ||
      !formData.whatsappNumber ||
      !formData.budget.min ||
      !formData.budget.max ||
      !formData.location.address ||
      !formData.location.coordinates[0] ||
      !formData.location.coordinates[1] ||
      formData.preferredCommunication.length === 0
    ) {
      toast.error("Please fill all required fields", { autoClose: 3000 });
      return;
    }
    const whatsapp = formData.whatsappNumber?.toString().replace(/\D/g, "");

    if (whatsapp.length < 10) {
      toast.error("WhatsApp number must be at least 10 digits", {
        autoClose: 3000,
      });
      return;
    }
    onSave(formData, initialData?._id || null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between mb-4 bg-blue-600 text-white p-3 rounded-lg">
          <h2 className="font-bold text-lg">
            {isViewMode
              ? "View Details"
              : initialData
                ? "Edit Need"
                : "Post New Need"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600">Title:</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full border p-2 rounded"
            />
          </div>

          {initialData && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Posted By:
                </label>
                <input
                  value={formData.userName}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  User Role:
                </label>
                <input
                  value={formData.userRole}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-600">Details:</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">
              Work Type:
            </label>
            <input
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">
              WhatsApp Number:
            </label>
            <input
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-600">
                Location / Address:
              </label>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={fetchLocation}
                  className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                >
                  📍 Fetch Location
                </button>
              )}
            </div>
            <input
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-500">
              Lat: {formData.location.coordinates[1]} | Lng:{" "}
              {formData.location.coordinates[0]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600">
                Min Budget:
              </label>
              <input
                name="budget.min"
                value={formData.budget.min}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">
                Max Budget:
              </label>
              <input
                name="budget.max"
                value={formData.budget.max}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Preferred Communication:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value="Whatsapp"
                  checked={formData.preferredCommunication.includes("Whatsapp")}
                  onChange={handleChange}
                  name="preferredCommunication"
                  disabled={isViewMode}
                />
                Whatsapp
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value="Call"
                  checked={formData.preferredCommunication.includes("Call")}
                  onChange={handleChange}
                  name="preferredCommunication"
                  disabled={isViewMode}
                />
                Call
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Image:
            </label>
            {!isViewMode && (
              <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-4 rounded-lg text-center cursor-pointer mb-2">
                <input
                  type="file"
                  name="images"
                  onChange={handleChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer text-blue-600 font-medium"
                >
                  📷 Click to upload image
                </label>
              </div>
            )}
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                className="w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              disabled={isViewMode}
            />
            <span className="text-sm font-bold text-gray-600">
              Featured Need
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {initialData ? "Save Changes" : "Post Need"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalNeeds;