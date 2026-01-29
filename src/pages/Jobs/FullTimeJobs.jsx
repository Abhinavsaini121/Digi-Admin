import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, X, Star, Lock, CheckCircle } from "lucide-react";

// 1. CORRECTED IMPORT: Only importing getAllFullTimeJobs as requested.
import {getAllFullTimeJobs} from "../../auth/adminLogin";

// --- Data Normalization Function (No Change) ---
const normalizeJobData = (job) => {
    // Determine the salary field (API uses 'salaryRange' for new jobs, 'budget' for old/other jobs)
    const salaryField = job.salaryRange || job.budget;

    return {
        _id: job._id,
        title: job.title,
        // Use companyName if available, otherwise 'Individual' or check userId's companyName
        companyName: job.companyName || (job.userId?.companyName || 'Individual'),
        location: job.location, 
        // Use jobRole if available, otherwise use workType, otherwise 'Not Specified'
        jobRole: job.jobRole || job.workType || "Not Specified", 
        
        // Normalize salary to 'budget' property for UI and Modal consistency
        budget: { 
            min: salaryField?.min || 0, 
            max: salaryField?.max || 0 
        },
        
        isFeatured: job.isFeatured || false,
        // unlockCount is missing in API, defaulting to 0
        unlockCount: job.unlockCount || 0, 
        // Map API status string to boolean isActive
        isActive: job.status === 'active', 
        images: job.images || [],
    };
};

const FullTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  // selectedJob state will now only be used for displaying details in the modal
  const [selectedJob, setSelectedJob] = useState(null); 

  // --- API Fetch Function (Only GET API is used) ---
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllFullTimeJobs(); // API Call
      
      const jobsArray = Array.isArray(response.data) ? response.data : [];
      setAllJobs(jobsArray.map(normalizeJobData)); 
      
    } catch (err) {
      console.error("Failed to fetch full-time jobs:", err);
      // Use the error message from the response if available
      setError(err.message || err.error || "An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // --- Actions ---

  // Kept handleEditClick to open the modal for viewing details
  const handleEditClick = (job) => {
    setSelectedJob({ 
        ...job,
        budget: {
            min: parseInt(job.budget?.min) || 0,
            max: parseInt(job.budget?.max) || 0
        }
    });
    setIsModalOpen(true);
  };
  
  // REMOVED: handleSaveEdit function
  // REMOVED: toggleFeature function
  // REMOVED: toggleStatus function


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
      ) : error ? ( 
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-red-200 p-4">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-red-700 text-center font-semibold">Error: {error}</span>
            <button 
                onClick={fetchJobs} 
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
                Try Again
            </button>
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
                            // Use first image URL or a placeholder
                            src={job.images?.[0] || "https://via.placeholder.com/150/f0f0f0/cccccc?text=Logo"} 
                            alt="logo" 
                            className="w-full h-full object-contain" 
                            />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{job.title}</p>
                          {/* Company Name is now normalized by 'normalizeJobData' */}
                          <p className="text-xs text-slate-500 mb-1.5">{job.companyName}</p>
                          {/* Location/Tag is now normalized by 'normalizeJobData' */}
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Job Role */}
                    <td className="p-4 align-top">
                      <span className="inline-block text-xs font-semibold text-slate-600 bg-blue-50/80 px-2.5 py-1 rounded text-blue-800">
                        {/* Job Role is now normalized by 'normalizeJobData' */}
                        {job.jobRole} 
                      </span>
                    </td>

                    {/* 3. Salary Range */}
                    <td className="p-4 align-top font-bold text-slate-700 text-sm whitespace-nowrap">
                      {/* Budget is now normalized to 'budget' property */}
                      ₹{job.budget?.min?.toLocaleString()} - ₹{job.budget?.max?.toLocaleString()}
                    </td>

                    {/* 4. Featured (Toggle functionality removed) */}
                    <td className="p-4 align-top text-center">
                      <div // Changed button to div/span to remove interactive click
                        className={`transition-all duration-200 cursor-default ${job.isFeatured ? 'text-amber-400' : 'text-slate-200'}`}
                      >
                        <Star size={18} fill={job.isFeatured ? "currentColor" : "none"} />
                      </div>
                    </td>

                    {/* 5. Unlock Count */}
                    <td className="p-4 align-top text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <Lock size={11} className="text-slate-400" />
                        {/* Using normalized unlockCount with default 0 */}
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

                    {/* 7. Actions */}
                    <td className="p-4 align-top">
                      <div className="flex flex-col items-center gap-2">
                        {/* Edit Button - Opens Read-Only Modal */}
                        <button 
                            onClick={() => handleEditClick(job)}
                            className="w-24 py-1.5 text-[11px] font-bold text-amber-500 border border-amber-200 rounded hover:bg-amber-50 transition-colors"
                        >
                            View Details
                        </button>
                        
                        {/* Status Button - Functionality Removed, now just a disabled-style placeholder */}
                        <button 
                            disabled // Disabled the button completely
                            className={`w-24 py-1.5 text-[11px] font-bold border rounded transition-colors flex items-center justify-center gap-1 cursor-not-allowed
                                ${job.isActive 
                                    ? "text-red-300 border-red-100 bg-red-50/50" 
                                    : "text-emerald-300 border-emerald-100 bg-emerald-50/50"
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

      {/* -------------------- UPDATED EDIT MODAL (Read-Only) -------------------- */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0">
              <h2 className="text-lg font-bold text-slate-800">Job Details (Read-Only)</h2>
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
                    value={selectedJob.title || ""} 
                    readOnly // Made read-only
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="label-text">Tag / Location</label>
                  <input 
                    type="text" 
                    value={selectedJob.location || ""} 
                    readOnly // Made read-only
                    className="input-field" 
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Job Role</label>
                <input 
                  type="text" 
                  value={selectedJob.jobRole || ""} 
                  readOnly // Made read-only
                  className="input-field" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div>
                  <label className="label-text">Min Pay (₹)</label>
                  <input 
                    type="number" 
                    value={selectedJob.budget?.min || 0} 
                    readOnly // Made read-only
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="label-text">Max Pay (₹)</label>
                  <input 
                    type="number" 
                    value={selectedJob.budget?.max || 0} 
                    readOnly // Made read-only
                    className="input-field" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                 <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-default select-none">
                        <input 
                            type="checkbox" 
                            checked={selectedJob.isFeatured || false}
                            disabled // Disabled
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-not-allowed"
                        />
                        <span className="text-sm text-slate-700 font-semibold">Featured</span>
                    </label>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Unlock Count:</span>
                    <input 
                        type="number" 
                        value={selectedJob.unlockCount || 0} 
                        readOnly // Made read-only
                        className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-md text-center font-bold text-slate-700 bg-slate-50 cursor-default" 
                    />
                 </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Close
              </button>
              <button 
                disabled // Disabled the Save button
                className="px-6 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-bold shadow-md cursor-not-allowed"
              >
                Save Changes (Disabled)
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
        /* Style for read-only fields */
        .input-field[readonly] {
            background-color: #f8fafc; /* Lighter background for read-only */
            border-color: #f0f4f8; 
            cursor: default;
        }
        .input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .input-field[readonly]:focus {
             box-shadow: none; /* Remove focus effect on read-only */
             border-color: #f0f4f8; 
        }
      `}</style>
    </div>
  );
};

export default FullTimeJobManagement;