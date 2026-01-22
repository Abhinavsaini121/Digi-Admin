import React, { useState, useEffect, useMemo } from "react";
import { AlertCircle, X, Star, Lock, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { getAllJobs, getJobById, updateJob } from "../../auth/adminLogin"; 

const PartTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false); 
  const [saveLoading, setSaveLoading] = useState(false);   

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => 
      job.jobCategory?.includes("Part-time") || 
      job.workType?.includes("Part-time")
    );
  }, [allJobs]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs();
      setAllJobs(response.data);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---

  const handleEditClick = async (jobId) => {
    setIsModalOpen(true); 
    setFetchLoading(true); 
    setSelectedJob(null); 

    try {
      const response = await getJobById(jobId);
      const apiData = response.data;

      // Backend se data aate waqt 'budget' ya 'salaryRange' check karein
      const minSalary = apiData.salaryRange?.min || apiData.budget?.min || 0;
      const maxSalary = apiData.salaryRange?.max || apiData.budget?.max || 0;

      setSelectedJob({
        _id: apiData._id,
        title: apiData.title || "",
        location: apiData.location || "",
        jobRole: apiData.workType || apiData.jobRole || "", 
        budget: {
            min: minSalary,
            max: maxSalary
        },
        unlockCount: apiData.unlockCount || 0,
        isFeatured: apiData.isFeatured || false,
        isActive: apiData.status === "active"
      });

    } catch (err) {
      console.error("Error fetching job details:", err);
      alert("Failed to fetch job details");
      setIsModalOpen(false); 
    } finally {
      setFetchLoading(false); 
    }
  };

  // --- SAVE FUNCTIONALITY (Corrected Payload) ---
  const handleSaveChanges = async () => {
    if (!selectedJob) return;

    try {
      setSaveLoading(true); 

      // ✅ FIX: Payload keys match your Backend Requirement
      const payload = {
          title: selectedJob.title,
          location: selectedJob.location,
    
          workType: selectedJob.jobRole, 
          
          // ✅ CRITICAL FIX: Backend wants 'salaryRange', NOT 'budget'
          salaryRange: {
              min: Number(selectedJob.budget.min),
              max: Number(selectedJob.budget.max)
          },
          
          status: selectedJob.isActive ? "active" : "inactive",
          unlockCount: Number(selectedJob.unlockCount),
          isFeatured: selectedJob.isFeatured
      };

      console.log("Sending Payload:", payload); // Debugging ke liye

      await updateJob(selectedJob._id, payload);

      alert("Job updated successfully!");
      setIsModalOpen(false);
      fetchData(); 

    } catch (err) {
      console.error("Update failed:", err);
      alert(err.message || "Failed to update job.");
    } finally {
      setSaveLoading(false); 
    }
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
            Part-time Job Management
          </h1>
          <p className="text-slate-500 text-sm">Manage all Part-time postings</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-transform active:scale-95">
          + Post New Part-time Job
        </button>
      </div>

      {error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 animate-pulse">
          <AlertCircle size={20} /> {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job Title & Details</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job Role</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Salary Range</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Featured</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Unlock Count</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                         <td className="p-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                         <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                         <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                         <td className="p-4"><div className="h-4 w-10 bg-slate-200 rounded"></div></td>
                         <td className="p-4"><div className="h-4 w-10 bg-slate-200 rounded"></div></td>
                         <td className="p-4"><div className="h-4 w-10 bg-slate-200 rounded"></div></td>
                         <td className="p-4"><div className="h-4 w-10 bg-slate-200 rounded"></div></td>
                    </tr>
                  ))
                ) : filteredJobs.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-slate-400">No jobs found.</td></tr>
                ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="p-4 align-top max-w-[250px]">
                      <div className="flex items-start gap-3">
                        <img 
                          src={job.images?.[0] || "https://placehold.co/150"} 
                          alt="job" 
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 mt-1 bg-slate-50" 
                        />                        
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{job.title}</p>
                          <p className="text-xs text-slate-500 mb-1">{job.companyName || "Individual"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 align-top"><span className="text-sm font-medium text-slate-700 bg-blue-50 px-2 py-1 rounded-md text-blue-700">{job.workType || job.jobRole || "N/A"}</span></td>
                    <td className="p-4 align-top font-bold text-slate-700 text-sm">₹{job.budget?.min || job.salaryRange?.min} - ₹{job.budget?.max || job.salaryRange?.max}</td>
                    
                    <td className="p-4 align-top text-center">
                       <Star size={20} className={job.isFeatured ? "text-amber-400 fill-amber-400 mx-auto" : "text-slate-300 mx-auto"} />
                    </td>
                    <td className="p-4 align-top text-center"><span className="text-xs font-bold text-slate-700">{job.unlockCount || 0}</span></td>
                    <td className="p-4 align-top text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.status === 'active' || job.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {job.status === 'active' || job.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex justify-center gap-2 flex-wrap max-w-[120px] mx-auto">
                        <ActionBtn text="Edit" variant="yellow" onClick={() => handleEditClick(job._id)} />
                        
                        <ActionBtn 
                            text={job.isActive !== false ? "Deactivate" : "Activate"} 
                            variant={job.isActive !== false ? "red" : "green"} 
                            onClick={() => toggleStatus(job._id)}
                        />
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- EDIT MODAL -------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800">Edit Part-time Job</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {fetchLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                 <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
                 <p className="text-sm font-medium">Fetching job details...</p>
              </div>
            ) : selectedJob ? (
              <>
                <div className="p-6 space-y-5">
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
                      <label className="label-text">Location</label>
                      <input 
                        type="text" 
                        value={selectedJob.location} 
                        onChange={(e) => setSelectedJob({...selectedJob, location: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Work Type / Role</label>
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

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div>
                        <label className="label-text">Unlock Count</label>
                        <input 
                            type="number" 
                            value={selectedJob.unlockCount} 
                            onChange={(e) => setSelectedJob({...selectedJob, unlockCount: parseInt(e.target.value)})}
                            className="input-field" 
                        />
                     </div>
                     
                     <div className="flex flex-col gap-2">
                        <label className="label-text">Settings</label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={selectedJob.isFeatured}
                                    onChange={(e) => setSelectedJob({...selectedJob, isFeatured: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 font-medium">Featured</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={selectedJob.isActive}
                                    onChange={(e) => setSelectedJob({...selectedJob, isActive: e.target.checked})}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-700 font-medium">Active</span>
                            </label>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    disabled={saveLoading}
                    className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={saveLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {saveLoading ? (
                        <>
                           <Loader2 size={16} className="animate-spin" /> Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                  </button>
                </div>
              </>
            ) : (
                <div className="p-8 text-center text-red-500">Failed to load data.</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .label-text {
            display: block;
            font-size: 0.75rem; 
            font-weight: 700;
            color: #64748b; 
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
        .input-field {
            width: 100%;
            padding: 0.625rem 1rem;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            outline: none;
            transition: all 0.2s;
            color: #334155;
            font-weight: 500;
        }
        .input-field:focus {
            box-shadow: 0 0 0 2px #3b82f6;
            border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

const ActionBtn = ({ text, variant, onClick, icon }) => {
    const styles = {
        yellow: "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-amber-200",
        red: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200",
        green: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-200",
    };
    return (
        <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold rounded-md border transition-all duration-200 shadow-sm whitespace-nowrap ${styles[variant]}`}>
            {icon} {text}
        </button>
    );
};

export default PartTimeJobManagement;