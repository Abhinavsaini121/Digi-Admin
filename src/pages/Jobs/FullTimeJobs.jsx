
import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, X, Star, Lock, CheckCircle, Plus } from "lucide-react"; 

import {getAllFullTimeJobs, createNewFullTimeJob} from "../../auth/adminLogin";

const normalizeJobData = (job) => {
    const salaryField = job.salaryRange || job.budget;

    return {
        _id: job._id,
        title: job.title,
        companyName: job.companyName || (job.userId?.companyName || 'Individual'),
        location: job.location, 
        jobRole: job.jobRole || job.workType || "Not Specified", 
        
        budget: { 
            min: salaryField?.min || 0, 
            max: salaryField?.max || 0 
        },
        
        isFeatured: job.isFeatured || false,
        unlockCount: job.unlockCount || 0, 
        isActive: job.status === 'active', 
        images: job.images || [],
    };
};

const FullTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); 
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [submitError, setSubmitError] = useState(null); 

  // New state for success popup
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // <--- ADDED

  const initialNewJobForm = {
      title: "",
      experience: "", 
      whatsappNumber: "", 
      jobDescription: "", 
      location: "", 
      jobRole: "", 
      budgetMin: 0, 
      budgetMax: 0, 
      unlockCount: 0,
      isFeatured: false,
      isActive: true, 
      images: null, 
  };
  const [newJobForm, setNewJobForm] = useState(initialNewJobForm);
  
  const handleNewJobChange = (e) => {
      const { name, value, type, checked } = e.target;
      setNewJobForm(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
      }));
  };

  const handleNewJobImageChange = (file) => {
      setNewJobForm(prev => ({
          ...prev,
          images: file,
      }));
  };

  const handleNewJobSubmit = async (e) => {
      e.preventDefault();
      setSubmitError(null);
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', newJobForm.title);
      formData.append('details', newJobForm.jobDescription); 
      formData.append('location', newJobForm.location);
      formData.append('jobRole', newJobForm.jobRole);
      formData.append('isFeatured', newJobForm.isFeatured);
      formData.append('status', newJobForm.isActive ? 'active' : 'inactive');
      
      formData.append('salaryRangeMin', newJobForm.budgetMin);
      formData.append('salaryRangeMax', newJobForm.budgetMax);

      formData.append('experience', newJobForm.experience); 
      formData.append('whatsappNumber', newJobForm.whatsappNumber); 
      formData.append('unlockCount', newJobForm.unlockCount);
      
      if (newJobForm.images) {
          formData.append('images', newJobForm.images); 
      }

      try {
          const response = await createNewFullTimeJob(formData);
          console.log("Job Posted Successfully:", response);
          
          await fetchJobs(); 
          
          setIsAddModalOpen(false); // Close the add job modal
          
          setNewJobForm(initialNewJobForm); 
          
          // alert("New Full-time Job posted successfully!"); // <-- REMOVED THIS ALERT
          setIsSuccessModalOpen(true); // <-- ADDED CUSTOM POPUP

      } catch (err) {
          console.error("Failed to post new job:", err);
          setSubmitError(err.message || err.error || "An error occurred during submission.");
      } finally {
          setIsSubmitting(false);
      }
  };


  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllFullTimeJobs(); 
      
      const jobsArray = Array.isArray(response.data) ? response.data : [];
      setAllJobs(jobsArray.map(normalizeJobData)); 
      
    } catch (err) {
      console.error("Failed to fetch full-time jobs:", err);
      setError(err.message || err.error || "An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
  

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Full-time Job Management
          </h1>
          <p className="text-slate-500 text-sm">Manage all Full-time postings</p>
        </div>
        <button 
          onClick={() => {
            setNewJobForm(initialNewJobForm); 
            setSubmitError(null); 
            setIsAddModalOpen(true); 
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-transform active:scale-95"
        >
          + Post New Job
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
                    <td className="p-4 align-top max-w-[280px]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-slate-100 bg-white p-1 flex-shrink-0 flex items-center justify-center">
                            <img 
                            src={job.images?.[0] || "https://via.placeholder.com/150/f0f0f0/cccccc?text=Logo"} 
                            alt="logo" 
                            className="w-full h-full object-contain" 
                            />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{job.title}</p>
                          <p className="text-xs text-slate-500 mb-1.5">{job.companyName}</p>
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <span className="inline-block text-xs font-semibold text-slate-600 bg-blue-50/80 px-2.5 py-1 rounded text-blue-800">
                        {job.jobRole} 
                      </span>
                    </td>

                    <td className="p-4 align-top font-bold text-slate-700 text-sm whitespace-nowrap">
                      ₹{job.budget?.min?.toLocaleString()} - ₹{job.budget?.max?.toLocaleString()}
                    </td>

                    <td className="p-4 align-top text-center">
                      <div 
                        className={`transition-all duration-200 cursor-default ${job.isFeatured ? 'text-amber-400' : 'text-slate-200'}`}
                      >
                        <Star size={18} fill={job.isFeatured ? "currentColor" : "none"} />
                      </div>
                    </td>

                    <td className="p-4 align-top text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                        <Lock size={11} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{job.unlockCount}</span>
                      </div>
                    </td>

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

                    <td className="p-4 align-top">
                      <div className="flex flex-col items-center gap-2">
                        <button 
                            onClick={() => handleEditClick(job)}
                            className="w-24 py-1.5 text-[11px] font-bold text-amber-500 border border-amber-200 rounded hover:bg-amber-50 transition-colors"
                        >
                            View Details
                        </button>
                        
                        <button 
                            disabled 
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

      {/* Post New Job Modal (isAddModalOpen) - KEPT THE SAME */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-800">Post New Full-time Job</h2>
              <button 
                onClick={() => {
                    setIsAddModalOpen(false);
                    setSubmitError(null); 
                }} 
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleNewJobSubmit} id="newJobForm" className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
              
              {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg flex items-center gap-3">
                      <AlertCircle size={18} />
                      <p>{submitError}</p>
                  </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                  <div>
                      <label className="label-text">Job Title</label>
                      <input 
                          type="text" 
                          name="title" 
                          value={newJobForm.title} 
                          onChange={handleNewJobChange} 
                          placeholder="E.g., Sales Manager"
                          className="input-field" 
                          required
                      />
                  </div>
                  <div>
                      <label className="label-text">Job Role</label>
                      <input 
                          type="text" 
                          name="jobRole" 
                          value={newJobForm.jobRole} 
                          onChange={handleNewJobChange} 
                          placeholder="E.g., Field Work"
                          className="input-field" 
                          required
                      />
                  </div>
                  <div>
                      <label className="label-text">Location/Tag</label>
                      <input 
                          type="text" 
                          name="location" 
                          value={newJobForm.location} 
                          onChange={handleNewJobChange} 
                          placeholder="E.g., Bangalore"
                          className="input-field" 
                          required
                      />
                  </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                  <div>
                      <label className="label-text">WhatsApp Number</label>
                      <input 
                          type="tel" 
                          name="whatsappNumber" 
                          value={newJobForm.whatsappNumber} 
                          onChange={handleNewJobChange} 
                          placeholder="9876543210"
                          className="input-field" 
                          required
                      />
                  </div>
                  <div>
                      <label className="label-text">Experience</label>
                      <input 
                          type="text" 
                          name="experience" 
                          value={newJobForm.experience} 
                          onChange={handleNewJobChange} 
                          placeholder="E.g., 2-5 Years"
                          className="input-field" 
                          required
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <div>
                          <label className="label-text">Min Pay (₹)</label>
                          <input 
                              type="number" 
                              name="budgetMin" 
                              value={newJobForm.budgetMin} 
                              onChange={handleNewJobChange} 
                              className="input-field" 
                          />
                      </div>
                      <div>
                          <label className="label-text">Max Pay (₹)</label>
                          <input 
                              type="number" 
                              name="budgetMax" 
                              value={newJobForm.budgetMax} 
                              onChange={handleNewJobChange} 
                              className="input-field" 
                          />
                      </div>
                  </div>
              </div>

              <div>
                <label className="label-text">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={newJobForm.jobDescription}
                  onChange={handleNewJobChange}
                  rows={5}
                  placeholder="Enter detailed job description and requirements..."
                  className="input-field resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-6 py-2 px-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex-shrink-0">
                      <label className="label-text !mb-1">Unlock Count</label>
                      <input 
                          type="number" 
                          name="unlockCount" 
                          value={newJobForm.unlockCount} 
                          onChange={handleNewJobChange} 
                          className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md text-center font-bold text-slate-700" 
                      />
                  </div>
                  
                  <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                              type="checkbox" 
                              name="isFeatured"
                              checked={newJobForm.isFeatured}
                              onChange={handleNewJobChange}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 font-semibold">Featured</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                              type="checkbox" 
                              name="isActive"
                              checked={newJobForm.isActive}
                              onChange={handleNewJobChange}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-blue-600 font-bold flex items-center gap-1">
                              <Plus size={14} className="text-blue-600" /> Active
                          </span>
                      </label>
                  </div>
              </div>

              <div>
                <label className="label-text flex items-center gap-2">
                    Job Images <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </label>
                <div className="mt-2 flex items-center gap-4">
                    <div 
                        className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/70 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => document.getElementById('newJobImageInput').click()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload text-slate-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span className="text-sm text-slate-500 mt-1">Upload</span>
                    </div>
                    <input
                        id="newJobImageInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleNewJobImageChange(e.target.files[0])}
                        className="hidden"
                    />

                    {newJobForm.images && (
                        <div className="relative w-32 h-32 rounded-lg border border-slate-200 overflow-hidden">
                            <img 
                                src={URL.createObjectURL(newJobForm.images)} 
                                alt="Job Preview" 
                                className="w-full h-full object-cover" 
                            />
                            <button
                                type="button"
                                onClick={() => handleNewJobImageChange(null)}
                                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-0.5 text-white transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>
              </div>
              
              <div className="h-4"></div> 
            </form>

            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
              <button 
                type="button"
                onClick={() => {
                    setIsAddModalOpen(false);
                    setSubmitError(null); 
                }}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="newJobForm" 
                onClick={handleNewJobSubmit}
                disabled={isSubmitting} 
                className={`px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2
                    ${isSubmitting 
                        ? "bg-blue-400 text-white cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
              >
                {isSubmitting ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Posting...
                    </>
                ) : (
                    "Post Job Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Job Details Modal (isModalOpen) - KEPT THE SAME */}
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
                    readOnly 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="label-text">Tag / Location</label>
                  <input 
                    type="text" 
                    value={selectedJob.location || ""} 
                    readOnly 
                    className="input-field" 
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Job Role</label>
                <input 
                  type="text" 
                  value={selectedJob.jobRole || ""} 
                  readOnly 
                  className="input-field" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                <div>
                  <label className="label-text">Min Pay (₹)</label>
                  <input 
                    type="number" 
                    value={selectedJob.budget?.min || 0} 
                    readOnly 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="label-text">Max Pay (₹)</label>
                  <input 
                    type="number" 
                    value={selectedJob.budget?.max || 0} 
                    readOnly 
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
                            disabled 
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
                        readOnly 
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
                disabled 
                className="px-6 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-bold shadow-md cursor-not-allowed"
              >
                Save Changes (Disabled)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Custom Job Post Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-8 flex flex-col items-center text-center">
              <CheckCircle size={48} className="text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Job Posted Successfully!</h3>
              <p className="text-slate-500 text-sm">The new full-time job has been successfully created and added to the list.</p>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors active:scale-[0.98]"
              >
                OK
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
        .input-field[readonly] {
            background-color: #f8fafc; 
            border-color: #f0f4f8; 
            cursor: default;
        }
        .input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .input-field[readonly]:focus {
             box-shadow: none; 
             border-color: #f0f4f8; 
        }
        
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default FullTimeJobManagement;