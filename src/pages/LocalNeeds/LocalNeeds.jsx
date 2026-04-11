import React, { useState } from "react";

const LocalNeeds = () => {
  // --- 1. SAMPLE DATA STATE ---
  const [tasks, setTasks] = useState([
    {
      id: "#LN1023",
      title: "Electrician Needed",
      details: "Wiring work for new 2BHK flat, urgent requirement.",
      category: "Home Services",
      subCategory: "Electrical",
      budget: "₹500 - ₹2000",
      featured: true,

      status: "Active",
    },
    {
      id: "#LN1024",
      title: "Used Sofa for Sale",
      details: "3 seater leather sofa, 2 years old, good condition.",
      category: "Buy & Sell",
      subCategory: "Furniture",
      budget: "₹8,500",
      featured: false,
      status: "Active",
    },
    {
      id: "#LN1025",
      title: "Math Tutor Required",
      details: "For Class 10th CBSE student, evening batch.",
      category: "Education",
      subCategory: "Tuition",
      budget: "₹3000/month",
      featured: false,
      status: "Expired",
    },
  ]);

  // --- 2. MODAL STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // --- 3. FUNCTIONS ---
  const toggleFeatured = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, featured: !task.featured } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeactivate = (id) => {
    if (window.confirm("Are you sure you want to deactivate this task?")) {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, status: "Closed" } : task
      );
      setTasks(updatedTasks);
    }
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
    setIsEditModalOpen(false);
    setCurrentTask(null);
  };

  const handlePostNew = (newTask) => {
    const finalTask = {
      ...newTask,
      id: `#LN${Math.floor(1000 + Math.random() * 9000)}`,
      status: newTask.status || "Active",
    };
    setTasks([finalTask, ...tasks]);
    setIsPostModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Expired": return "bg-red-100 text-red-700";
      case "Closed": return "bg-gray-200 text-gray-500";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Local Needs (Tasks) Management</h1>
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow font-semibold transition"
        >
          + Post New Need
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="Active" value={tasks.filter((t) => t.status === "Active").length} />
        <StatCard title="Featured" value={tasks.filter((t) => t.featured).length} />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b">
              <tr>
                <th className="p-4">Task Info</th>
                <th className="p-4">Category / Sub</th>
                <th className="p-4">Budget</th>
                <th className="p-4 text-center">Featured?</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{task.title}</div>
                    <p className="text-xs text-gray-500 mt-1">{task.details}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">{task.id}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-800 font-medium">{task.category}</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold">
                      {task.subCategory}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-700">{task.budget}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleFeatured(task.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${task.featured ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {task.featured ? "★ Yes" : "No"}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 font-bold text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(task.id)}
                        disabled={task.status !== "Active"}
                        className={`px-4 py-1.5 rounded border font-bold text-xs transition ${task.status === "Active"
                          ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          }`}
                      >
                        {task.status === "Active" ? "Deactivate" : "Closed"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- COMPACT THEMED MODAL --- */}
      {(isEditModalOpen || isPostModalOpen) && (
        <ThemedTaskModal
          mode={isEditModalOpen ? "Edit" : "Post"}
          task={isEditModalOpen ? currentTask : { title: "", details: "", category: "", subCategory: "", budget: "", featured: false, status: "Active", unlocks: 0 }}
          onSave={isEditModalOpen ? handleSaveEdit : handlePostNew}
          onClose={() => { setIsEditModalOpen(false); setIsPostModalOpen(false); }}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    <h2 className="text-2xl font-extrabold text-gray-800 mt-1">{value}</h2>
  </div>
);

const ThemedTaskModal = ({ mode, task, onSave, onClose }) => {
  const [formData, setFormData] = useState(task);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      {/* Modal width reduced to max-w-md for a compact look */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">

        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">
            {mode === "Edit" ? "Edit Task" : "Post New Need"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Row 1: Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Task Title</label>
            <input
              name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-slate-700"
              placeholder="e.g. Electrician Needed"
            />
          </div>

          {/* Row 2: Category & SubCategory */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
              <input
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none"
                placeholder="Home Services"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Sub-Category</label>
              <input
                name="subCategory" value={formData.subCategory} onChange={handleChange} required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none"
                placeholder="Electrical"
              />
            </div>
          </div>

          {/* Row 3: Budget & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Budget</label>
              <input
                name="budget" value={formData.budget} onChange={handleChange} required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none font-semibold text-blue-600"
                placeholder="₹500 - ₹2000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Row 4: Details */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Task Details</label>
            <textarea
              name="details" value={formData.details} onChange={handleChange} required rows="2"
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none"
              placeholder="Requirement details..."
            />
          </div>

          {/* Row 5: Admin Mini Actions */}
          <div className="flex items-center justify-between py-2 px-1 bg-blue-50/50 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox" name="featured" id="feat" checked={formData.featured} onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
              />
              <label htmlFor="feat" className="text-xs font-bold text-slate-600 cursor-pointer">Featured</label>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-blue-700 transition"
            >
              {mode === "Edit" ? "Update Task" : "Post Need"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalNeeds;