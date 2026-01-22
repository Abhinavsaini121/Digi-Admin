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
      unlocks: 23,
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
      unlocks: 5,
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
      unlocks: 45,
      status: "Expired",
    },
  ]);

  // --- 2. MODAL STATE (For Edit) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // --- 3. FUNCTIONS ---

  // Function: Toggle Featured (Yes <-> No)
  const toggleFeatured = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, featured: !task.featured } : task
    );
    setTasks(updatedTasks);
  };

  // Function: Deactivate Task
  const handleDeactivate = (id) => {
    if (window.confirm("Are you sure you want to deactivate this task?")) {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, status: "Closed" } : task
      );
      setTasks(updatedTasks);
    }
  };

  // Function: Open Edit Modal
  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  // Function: Save Changes from Modal
  const handleSaveEdit = (editedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  // Helper: Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Expired": return "bg-red-100 text-red-700";
      case "Closed": return "bg-gray-200 text-gray-500";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Local Needs (Tasks) Management
        </h1>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
          + Post New Need
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="Active" value={tasks.filter((t) => t.status === "Active").length} />
        <StatCard title="Featured" value={tasks.filter((t) => t.featured).length} />
        <StatCard title="Total Unlocks" value={tasks.reduce((acc, curr) => acc + curr.unlocks, 0)} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="p-4">Task Info</th>
                <th className="p-4">Category / Sub</th>
                <th className="p-4">Budget</th>
                <th className="p-4 text-center">Unlocks</th>
                <th className="p-4 text-center">Featured?</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Admin Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Title & Details */}
                  <td className="p-4 max-w-xs">
                    <div className="font-bold text-gray-800">{task.title}</div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{task.details}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                      {task.id}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <div className="text-gray-800 font-medium">{task.category}</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {task.subCategory}
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="p-4 font-medium text-gray-700">{task.budget}</td>

                  {/* Unlock Count */}
                  <td className="p-4 text-center">
                    <span className="font-bold text-gray-800">{task.unlocks}</span>
                  </td>

                  {/* Featured Toggle (Clickable) */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleFeatured(task.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
                        task.featured
                          ? "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {task.featured ? "★ Yes" : "No"}
                    </button>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* Edit Button (Opens Modal) */}
                      <button 
                        onClick={() => openEditModal(task)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-xs font-medium transition border border-blue-200"
                      >
                        Edit
                      </button>

                      {/* Deactivate Button (Functional) */}
                      {task.status === "Active" ? (
                        <button
                          onClick={() => handleDeactivate(task.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs font-medium transition border border-red-200"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded cursor-not-allowed text-xs font-medium border border-gray-200">
                          Closed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT MODAL (MODULE) --- */}
      {isModalOpen && (
        <EditTaskModal 
          task={currentTask} 
          onSave={handleSaveEdit} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. Stat Card
const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
    <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
  </div>
);

// 2. Edit Modal Component (UPDATED BACKGROUND HERE)
const EditTaskModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState(task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    // 👇 यहाँ पर मैंने bg-black हटा दिया और हल्का blur लगा दिया
    <div className="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Task Module</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold">✕</button>
        </div>
        
        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <textarea 
              name="details" 
              value={formData.details} 
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget</label>
              <input 
                type="text" 
                name="budget" 
                value={formData.budget} 
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalNeeds;