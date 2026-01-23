/*import React, { useState } from "react";

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
     
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Local Needs (Tasks) Management
        </h1>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
          + Post New Need
        </button>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value={tasks.length} />
        <StatCard title="Active" value={tasks.filter((t) => t.status === "Active").length} />
        <StatCard title="Featured" value={tasks.filter((t) => t.featured).length} />
        <StatCard title="Total Unlocks" value={tasks.reduce((acc, curr) => acc + curr.unlocks, 0)} />
      </div>

    
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
                  
               
                  <td className="p-4 max-w-xs">
                    <div className="font-bold text-gray-800">{task.title}</div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{task.details}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                      {task.id}
                    </span>
                  </td>

               
                  <td className="p-4">
                    <div className="text-gray-800 font-medium">{task.category}</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {task.subCategory}
                    </div>
                  </td>

                  <td className="p-4 font-medium text-gray-700">{task.budget}</td>

                 
                  <td className="p-4 text-center">
                    <span className="font-bold text-gray-800">{task.unlocks}</span>
                  </td>

                  
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

                
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>

              
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                    
                      <button 
                        onClick={() => openEditModal(task)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-xs font-medium transition border border-blue-200"
                      >
                        Edit
                      </button>

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
    
    <div className="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
       
        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Task Module</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold">✕</button>
        </div>
        
      
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

export default LocalNeeds;*/
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
      unlocks: 0,
      status: "Active",
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
        <StatCard title="Total Unlocks" value={tasks.reduce((acc, curr) => acc + curr.unlocks, 0)} />
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
                <th className="p-4 text-center">Unlocks</th>
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
                  <td className="p-4 text-center font-bold text-gray-800">{task.unlocks}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleFeatured(task.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                        task.featured ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-gray-100 text-gray-500"
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
                        className={`px-4 py-1.5 rounded border font-bold text-xs transition ${
                          task.status === "Active" 
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

      {/* --- THEMED MODAL (Used for both Edit and Post) --- */}
      {(isEditModalOpen || isPostModalOpen) && (
        <ThemedTaskModal 
          mode={isEditModalOpen ? "Edit" : "Post"}
          task={isEditModalOpen ? currentTask : { title: "", details: "", category: "", subCategory: "", budget: "", featured: false }} 
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[550px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1e293b]">
            {mode === "Edit" ? "Edit Job Details" : "Post New Job Need"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job Title</label>
              <input 
                name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-700 font-medium" 
                placeholder="Flutter Developer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tag / Location</label>
              <input 
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-700 font-medium"
                placeholder="Doctorate (Ph.D.)"
              />
            </div>
          </div>

          {/* Row 2: Details */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job Role / Details</label>
            <textarea 
              name="details" value={formData.details} onChange={handleChange} required rows="2"
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-700 font-medium"
              placeholder="Flutter Developer"
            />
          </div>

          {/* Row 3: Budget/Pay */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Min Pay (₹)</label>
              <input 
                name="budget" value={formData.budget} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-700 font-medium"
                placeholder="2000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Max Pay (₹)</label>
              <input 
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-700 font-medium"
                placeholder="100000"
              />
            </div>
          </div>

          {/* Row 4: Featured & Unlock */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" name="featured" id="feat" checked={formData.featured} onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="feat" className="text-sm font-bold text-slate-600 cursor-pointer">Featured</label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unlock Count:</span>
              <div className="px-6 py-2 bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-700">
                {mode === "Edit" ? task.unlocks : 0}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-6 pt-6 border-t border-gray-50">
            <button 
              type="button" onClick={onClose} 
              className="text-sm font-bold text-slate-500 hover:text-slate-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-10 py-3 bg-[#2563eb] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
            >
              {mode === "Edit" ? "Save Changes" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalNeeds;