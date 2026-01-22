import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, X, Star, Lock, EyeOff, CheckCircle } from "lucide-react";

// --- DUMMY DATA FOR FULL-TIME JOBS (Based on your screenshot) ---
const DUMMY_FULL_TIME_JOBS = [
  {
    _id: "ft-001",
    title: "Flutter Developer (Full-Time)",
    companyName: "Time2Cash Technologies Pvt Ltd",
    location: "Doctorate (Ph.D.)", // Using this field for the tag shown in screenshot
    jobRole: "Flutter Developer",
    budget: { min: 2000, max: 100000 },
    isFeatured: false,
    unlockCount: 0,
    isActive: true,
    images: ["https://cdn-icons-png.flaticon.com/512/5968/5968705.png"] // Flutter icon placeholder
  },
  {
    _id: "ft-002",
    title: "cfgg",
    companyName: "Individual",
    location: "Doctorate (Ph.D.)",
    jobRole: "Not Specified",
    budget: { min: 2, max: 89 },
    isFeatured: false,
    unlockCount: 0,
    isActive: true,
    images: ["https://via.placeholder.com/150/f0f0f0/cccccc?text=IMG"] 
  },
  {
    _id: "ft-003",
    title: "Senior Backend Engineer",
    companyName: "TechFlow Systems",
    location: "Bangalore, India",
    jobRole: "Backend Dev",
    budget: { min: 1200000, max: 2400000 },
    isFeatured: true,
    unlockCount: 15,
    isActive: true,
    images: ["https://cdn-icons-png.flaticon.com/512/919/919825.png"] // Node js icon
  },
  {
    _id: "ft-004",
    title: "cfgg",
    companyName: "Individual",
    location: "Doctorate (Ph.D.)",
    jobRole: "Not Specified",
    budget: { min: 2, max: 89 },
    isFeatured: false,
    unlockCount: 0,
    isActive: true,
    images: ["https://via.placeholder.com/150/f0f0f0/cccccc?text=IMG"] 
  },
  {
    _id: "ft-005",
    title: "Product Manager",
    companyName: "Innovate Inc",
    location: "Mumbai",
    jobRole: "Manager",
    budget: { min: 80000, max: 150000 },
    isFeatured: false,
    unlockCount: 3,
    isActive: false, // Inactive example
    images: ["https://cdn-icons-png.flaticon.com/512/3003/3003984.png"]
  }
];

const FullTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    // Simulate API Loading
    setTimeout(() => {
      setAllJobs(DUMMY_FULL_TIME_JOBS);
      setLoading(false);
    }, 800);
  }, []);

  // --- Actions ---

  const handleEditClick = (job) => {
    setSelectedJob({ ...job });
    setIsModalOpen(true);
  };

  const toggleFeature = (jobId) => {
    const updatedJobs = allJobs.map(job => 
      job._id === jobId ? { ...job, isFeatured: !job.isFeatured } : job
    );
    setAllJobs(updatedJobs);
  };

  const toggleStatus = (jobId) => {
    const updatedJobs = allJobs.map(job => 
      job._id === jobId ? { ...job, isActive: !job.isActive } : job
    );
    setAllJobs(updatedJobs);
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Full-time Job Management
          </h1>
          <p className="text-slate-500 text-sm">Manage all Full-time postings</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-transform active:scale-95">
          + Post New Full-time Job
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <span className="text-slate-400 text-sm">Loading jobs...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job Title & Details</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job Role</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Salary Range</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Featured</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Unlock Count</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* 1. Job Title & Details */}
                    <td className="p-4 align-top max-w-[280px]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-slate-100 bg-white p-1 flex-shrink-0 flex items-center justify-center">
                            <img 
                            src={job.images?.[0]} 
                            alt="logo" 
                            className="w-full h-full object-contain" 
                            />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{job.title}</p>
                          <p className="text-xs text-slate-500 mb-1.5">{job.companyName}</p>
                          {/* Badge matching screenshot style */}
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Job Role */}
                    <td className="p-4 align-top">
                      <span className="inline-block text-xs font-semibold text-slate-600 bg-blue-50/80 px-2.5 py-1 rounded text-blue-800">
                        {job.jobRole}
                      </span>
                    </td>

                    {/* 3. Salary Range */}
                    <td className="p-4 align-top font-bold text-slate-700 text-sm whitespace-nowrap">
                      ₹{job.budget?.min?.toLocaleString()} - ₹{job.budget?.max?.toLocaleString()}
                    </td>

                    {/* 4. Featured Toggle */}
                    <td className="p-4 align-top text-center">
                      <button 
                        onClick={() => toggleFeature(job._id)}
                        className={`transition-all duration-200 ${job.isFeatured ? 'text-amber-400 hover:text-amber-500' : 'text-slate-200 hover:text-slate-300'}`}
                      >
                        <Star size={18} fill={job.isFeatured ? "currentColor" : "none"} />
                      </button>
                    </td>

                    {/* 5. Unlock Count */}
                    <td className="p-4 align-top text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <Lock size={11} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{job.unlockCount}</span>
                      </div>
                    </td>

                    {/* 6. Status */}
                    <td className="p-4 align-top text-center">
                      {job.isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-600 rounded-full uppercase tracking-wide">
                           <CheckCircle size={10} fill="currentColor" className="text-emerald-600" /> ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-red-100 text-red-600 rounded-full uppercase tracking-wide">
                           <X size={10} fill="currentColor" className="text-red-600" /> INACTIVE
                        </span>
                      )}
                    </td>

                    {/* 7. Actions (Styled like screenshot) */}
                    <td className="p-4 align-top">
                      <div className="flex flex-col items-center gap-2">
                        {/* Edit Button - Yellow Outline */}
                        <button 
                            onClick={() => handleEditClick(job)}
                            className="w-24 py-1.5 text-[11px] font-bold text-amber-500 border border-amber-200 rounded hover:bg-amber-50 transition-colors"
                        >
                            Edit
                        </button>
                        
                        {/* Deactivate Button - Red Outline */}
                        <button 
                            onClick={() => toggleStatus(job._id)}
                            className={`w-24 py-1.5 text-[11px] font-bold border rounded transition-colors flex items-center justify-center gap-1
                                ${job.isActive 
                                    ? "text-red-500 border-red-200 hover:bg-red-50" 
                                    : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                }`}
                        >
                           {job.isActive ? <>Deactivate</> : <>Activate</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- EDIT MODAL -------------------- */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0">
              <h2 className="text-lg font-bold text-slate-800">Edit Job Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Job Title</label>
                  <input 
                    type="text" 
                    value={selectedJob.title} 
                    onChange={(e) => setSelectedJob({...selectedJob, title: e.target.value})}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="label-text">Tag / Location</label>
                  <input 
                    type="text" 
                    value={selectedJob.location} 
                    onChange={(e) => setSelectedJob({...selectedJob, location: e.target.value})}
                    className="input-field" 
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Job Role</label>
                <input 
                  type="text" 
                  value={selectedJob.jobRole} 
                  onChange={(e) => setSelectedJob({...selectedJob, jobRole: e.target.value})}
                  className="input-field" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Min Pay (₹)</label>
                  <input 
                    type="number" 
                    value={selectedJob.budget?.min} 
                    onChange={(e) => setSelectedJob({...selectedJob, budget: {...selectedJob.budget, min: e.target.value}})}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="label-text">Max Pay (₹)</label>
                  <input 
                    type="number" 
                    value={selectedJob.budget?.max} 
                    onChange={(e) => setSelectedJob({...selectedJob, budget: {...selectedJob.budget, max: e.target.value}})}
                    className="input-field" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                 <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            checked={selectedJob.isFeatured}
                            onChange={(e) => setSelectedJob({...selectedJob, isFeatured: e.target.checked})}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700 font-semibold">Featured</span>
                    </label>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Unlock Count:</span>
                    <input 
                        type="number" 
                        value={selectedJob.unlockCount} 
                        onChange={(e) => setSelectedJob({...selectedJob, unlockCount: parseInt(e.target.value)})}
                        className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-md text-center font-bold text-slate-700" 
                    />
                 </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-text {
            display: block;
            font-size: 0.7rem; 
            font-weight: 700;
            color: #94a3b8; 
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.4rem;
        }
        .input-field {
            width: 100%;
            padding: 0.6rem 0.9rem;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            outline: none;
            font-size: 0.9rem;
            transition: all 0.2s;
            color: #334155;
            font-weight: 500;
        }
        .input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

export default FullTimeJobManagement;