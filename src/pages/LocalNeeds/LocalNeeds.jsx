import React, { useState, useEffect } from "react";
import {
  getAllLocalJobs,
  createLocalJob,
  deleteLocalJob,
} from "../../auth/adminLogin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const LocalNeeds = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [jobType, setJobType] = useState("ADMIN");
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

  const handlePostNewAPI = async (newTask) => {
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

      const res = await createLocalJob(formData);

      setTasks((prev) => [res.data, ...prev]);
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
    console.log(task); // ya modal open logic
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
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
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">S.No</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
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
                <td className="p-4">
                  {(page - 1) * 10 + i + 1} {/* ✅ ADD THIS LINE */}
                </td>
                <td className="p-4">
                  <img
                    src={t.images?.[0]}
                    alt="job"
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>

                <td className="p-4">{t.title}</td>

                <td className="p-4">{t.location?.address || "No Address"}</td>

                <td className="p-4">{t.workType}</td>

                <td className="p-4">{t.whatsappNumber}</td>

                <td className="p-4">{t.status}</td>
                <td className="p-4 flex gap-2">
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
          onSave={handlePostNewAPI}
          onClose={() => setIsPostModalOpen(false)}
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

// ================= MODAL =================

const ThemedTaskModal = ({ onSave, onClose }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    workType: "",
    whatsappNumber: "",
    budget: { min: "", max: "" },
    preferredCommunication: [],
    location: { type: "Point", coordinates: ["", ""], address: "" },
    images: null,
    isFeatured: false,
    status: "expired",
    expiresAt: "",
  });

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
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between mb-4 bg-blue-600 text-white p-3 rounded-lg">
          <h2 className="font-bold text-lg">Post New Need</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
          />

          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Details"
            className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
          />
          <input
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            placeholder="Work Type"
            className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
          />

          <input
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            placeholder="WhatsApp Number"
            className="w-full border border-blue-200 bg-blue-50 p-2 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fetchLocation}
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
            >
              📍 Fetch Location
            </button>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-xs text-gray-500">
                Lat: {formData.location.coordinates[1]} | Lng:{" "}
                {formData.location.coordinates[0]}
              </p>
              <input
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded col-span-2"
              />
            </div>
            <input
              name="budget.min"
              value={formData.budget.min}
              onChange={handleChange}
              placeholder="Min Budget"
              className="border p-2 rounded"
            />
            <input
              name="budget.max"
              value={formData.budget.max}
              onChange={handleChange}
              placeholder="Max Budget"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                value="Whatsapp"
                checked={formData.preferredCommunication.includes("Whatsapp")}
                onChange={handleChange}
                name="preferredCommunication"
              />
              Whatsapp
            </label>

            <label>
              <input
                type="checkbox"
                value="Call"
                checked={formData.preferredCommunication.includes("Call")}
                onChange={handleChange}
                name="preferredCommunication"
              />
              Call
            </label>
          </div>

          <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-4 rounded-lg text-center cursor-pointer">
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

            <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG</p>
          </div>
          {previewImage && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Selected Image:</p>
              <img
                src={previewImage}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          )}
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Featured
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Post Need
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalNeeds;
