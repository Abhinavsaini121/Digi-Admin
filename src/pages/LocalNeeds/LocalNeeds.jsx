import React, { useState } from "react";
import { postLocalJob } from "../../auth/adminLogin";

const LocalNeeds = () => {

  const [tasks, setTasks] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // ✅ API CALL
  const handlePostNewAPI = async (newTask) => {
    try {
      const formData = new FormData();

      formData.append("title", newTask.title);
      formData.append("details", newTask.details);
      formData.append("jobCategory", "LOCAL_JOB");
      formData.append("isFeatured", newTask.isFeatured);
      formData.append("status", newTask.status);
      formData.append("expiresAt", newTask.expiresAt);

      formData.append("location[type]", "Point");
      formData.append("location[coordinates][]", newTask.location.coordinates[0]);
      formData.append("location[coordinates][]", newTask.location.coordinates[1]);
      formData.append("location[address]", newTask.location.address);

      if (newTask.images) {
        formData.append("images", newTask.images);
      }

      const res = await postLocalJob(formData);

      setTasks((prev) => [res.data, ...prev]);
      setIsPostModalOpen(false);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Local Needs Management</h1>
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Post New Need
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i} className="border-t">
                <td className="p-4">{t.title}</td>
                <td className="p-4">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isPostModalOpen && (
        <ThemedTaskModal
          onSave={handlePostNewAPI}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
    </div>
  );
};

// ================= MODAL =================

const ThemedTaskModal = ({ onSave, onClose }) => {

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    location: { type: "Point", coordinates: ["", ""], address: "" },
    images: null,
    isFeatured: false,
    status: "expired",
    expiresAt: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "images") {
      setFormData({ ...formData, images: files[0] });

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

    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Post New Need</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full border p-2 rounded"
          />

          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Details"
            className="w-full border p-2 rounded"
          />

          <input
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              name="location.coordinates[0]"
              value={formData.location.coordinates[0]}
              onChange={handleChange}
              placeholder="Lat"
              className="border p-2 rounded"
            />
            <input
              name="location.coordinates[1]"
              value={formData.location.coordinates[1]}
              onChange={handleChange}
              placeholder="Lng"
              className="border p-2 rounded"
            />
          </div>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="closed">Closed</option>
          </select>

          <input
            type="datetime-local"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input type="file" name="images" onChange={handleChange} />

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