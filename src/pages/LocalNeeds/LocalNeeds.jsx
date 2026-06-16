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

        setTasks(res.data); // list
        setPagination(res.pagination); // pagination store
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [page]); // 👈 IMPORTANT

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
      formData.append(
        "location[coordinates][]",
        newTask.location.coordinates[0],
      );
      formData.append(
        "location[coordinates][]",
        newTask.location.coordinates[1],
      );
      formData.append("location[address]", newTask.location.address);

      if (newTask.images) {
        formData.append("images", newTask.images);
      }

      let res;
      if (id) {
        res = await updateLocalJob(id, formData);
        setTasks((prev) =>
          prev.map((item) => (item._id === id ? res.data : item)),
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

      toast.success("Deleted successfully", { autoClose: 4000 }); // 👈 ADD THIS LINE

      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (task) => {
    setSelectedTask(task); // Pass the whole object
    setIsPostModalOpen(true);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen ">
      {" "}
      {/* Header */}
      <div className="flex justify-between items-center mt-5 mb-6">
        <h1 className="text-2xl font-bold">Local Needs Management</h1>

        <div className="flex items-center gap-3">
          {/* ✅ DROPDOWN */}
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
            className="px-3 py-2 border rounded-lg bg-white shadow-sm"
          >
            <option value="" disabled hidden>
              Select Type
            </option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>

          {/* Existing Button */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            + Post New Need
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow mt-15">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Posted By</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Work Type</th>
                <th className="p-4 text-left">WhatsApp</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4">{(page - 1) * 10 + i + 1}</td>
                  <td className="p-4">
                    <img
                      src={t.images?.[0]}
                      alt="job"
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">{t.title}</td>
                  <td className="p-4">{t.userId?.name || "N/A"}</td>
                  <td className="p-4">{t.userId?.role || "N/A"}</td>
                  <td className="p-4">{t.location?.address || "No Address"}</td>
                  <td className="p-4">{t.workType}</td>
                  <td className="p-4">{t.whatsappNumber}</td>
                  <td className="p-4">{t.status}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTask(t);
                        setIsViewMode(true);
                        setIsPostModalOpen(true);
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(t)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Prev
            </button>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </div>
        {/* Modal */}
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
      </div>{" "}
    </div>
  );
};

// ================= MODAL =================

const ThemedTaskModal = ({ onSave, onClose, initialData, isViewMode }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    workType: "",
    whatsappNumber: "",
    userName: "", // Add this
    userRole: "", // Add this
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
      userName: initialData.userId?.name || "N/A", // Add this
      userRole: initialData.userId?.role || "N/A", // Add this
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
        {/* Header */}
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
          {/* Title */}
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

          {/* User Info Row */}
          {/* User Info Row - ONLY SHOWS IF initialData EXISTS (Edit or View Mode) */}
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

          {/* Details */}
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

          {/* Work Type */}
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

          {/* WhatsApp Number */}
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

          {/* Location Section */}
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

          {/* Budget Row */}
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

          {/* Communication */}
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

          {/* Image Section */}
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

          {/* Featured Checkbox */}
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

          {/* Footer Buttons */}
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
