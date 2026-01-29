
import React, { useState, useEffect, useMemo, useRef } from "react";
import { AlertCircle, X, Star, Trash2, PlusCircle, Loader2, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { getAllJobs, getJobById, updateJob, deleteJob, createNewJob } from "../../auth/adminLogin"; 
import toast, { Toaster } from "react-hot-toast";
import JobViewModal from "./JobDetailsModal"; 

const PartTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [newImages, setNewImages] = useState([]); // For Edit Modal
  const [createImages, setCreateImages] = useState([]); // For Create Modal
  
  const fileInputRef = useRef(null);
  const createFileInputRef = useRef(null);

  const [newJob, setNewJob] = useState({
    title: "",
    companyName: "",
    location: "",
    jobRole: "",
    workType: "",
    vacancies: 1,
    minPay: "",
    maxPay: "",
    details: "",
    whatsappNumber: "",
    experience: "",
    qualification: "",
    unlockCount: 0,
    isFeatured: false,
    isActive: true
  });

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
      toast.error("Error fetching job list");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (jobId) => {
    setIsViewModalOpen(true);
    setFetchLoading(true);
    try {
      const response = await getJobById(jobId);
      setSelectedJob(response.data.data || response.data);
    } catch (err) {
      toast.error("Failed to fetch job details");
      setIsViewModalOpen(false);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        setSaveLoading(true);
        await deleteJob(jobId);
        toast.success("Job deleted successfully!");
        fetchData();
      } catch (err) {
        toast.error(err.message || "Failed to delete job.");
      } finally {
        setSaveLoading(false);
      }
    }
  };
  
  const handleEditClick = async (jobId) => {
    setIsEditModalOpen(true); 
    setFetchLoading(true); 
    setSelectedJob(null); 
    setNewImages([]);
    try {
      const response = await getJobById(jobId);
      const apiData = response.data.data || response.data;
      
      setSelectedJob({
        ...apiData,
        _id: apiData._id,
        title: apiData.title || "",
        companyName: apiData.companyName || "",
        location: apiData.location || "",
        jobRole: apiData.jobRole || apiData.workType || "", 
        workType: apiData.workType || "",
        vacancies: apiData.vacancies || 0,
        details: apiData.details || "",
        whatsappNumber: apiData.whatsappNumber || "",
        experience: apiData.experience || "",
        qualification: apiData.qualification || "",
        budget: { 
            min: apiData.budget?.min || apiData.salaryRange?.min || 0, 
            max: apiData.budget?.max || apiData.salaryRange?.max || 0 
        },
        unlockCount: apiData.unlockCount || 0,
        isFeatured: apiData.isFeatured || false,
        isActive: apiData.status === "active",
        existingImages: apiData.images || []
      });
    } catch (err) {
      toast.error("Failed to fetch job details");
      setIsEditModalOpen(false); 
    } finally {
      setFetchLoading(false); 
    }
  };

  // --- Image Handling Logic ---
  const removeExistingImage = (imgUrl) => {
    setSelectedJob(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter(img => img !== imgUrl)
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleCreateFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setCreateImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeCreateImage = (index) => {
    setCreateImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!selectedJob) return;
    try {
      setSaveLoading(true); 
      const payload = {
          title: selectedJob.title,
          companyName: selectedJob.companyName,
          location: selectedJob.location,
          workType: selectedJob.jobRole,
          jobRole: selectedJob.jobRole,
          vacancies: Number(selectedJob.vacancies),
          details: selectedJob.details,
          whatsappNumber: selectedJob.whatsappNumber,
          experience: selectedJob.experience,
          qualification: selectedJob.qualification,
          salaryRange: { min: Number(selectedJob.budget.min), max: Number(selectedJob.budget.max) },
          status: selectedJob.isActive ? "active" : "inactive",
          unlockCount: Number(selectedJob.unlockCount),
          isFeatured: selectedJob.isFeatured,
          images: selectedJob.existingImages
      };
      await updateJob(selectedJob._id, payload);
      toast.success("Job updated successfully!");
      setIsEditModalOpen(false);
      fetchData(); 
    } catch (err) {
      toast.error(err.message || "Failed to update job.");
    } finally {
      setSaveLoading(false); 
    }
  };

  const handleCreateNewJob = async () => {
    try {
      setSaveLoading(true);
      const payload = {
        ...newJob,
        salaryRange: { min: Number(newJob.minPay), max: Number(newJob.maxPay) },
        status: newJob.isActive ? "active" : "inactive",
        jobCategory: "Part-time",
        workType: newJob.jobRole,
        jobRole: newJob.jobRole
      };
      await createNewJob(payload);
      toast.success("New Part-time Job posted successfully!");
      setIsCreateModalOpen(false);
      // Reset State
      setNewJob({ title: "", companyName: "", location: "", jobRole: "", minPay: "", maxPay: "", vacancies: 1, details: "", whatsappNumber: "", experience: "", qualification: "", unlockCount: 0, isFeatured: false, isActive: true });
      setCreateImages([]);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create job.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Part-time Job Management</h1>
          <p className="text-slate-500 text-sm">Manage all Part-time postings</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transition-transform active:scale-95"
        >
          <PlusCircle size={18} />Post New Job
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job Title & Details</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job Role</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Salary Range</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Featured</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Unlock</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                    <tr><td colSpan="7" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
                ) : filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 align-top max-w-[250px]">
                      <div className="flex items-start gap-3">
                        <img src={job.images?.[0] || "https://placehold.co/150"} alt="job" className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50" />                        
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.location || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top"><span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{job.workType || job.jobRole || "N/A"}</span></td>
                    <td className="p-4 align-top font-bold text-slate-700 text-sm">₹{job.salaryRange?.min} - ₹{job.salaryRange?.max}</td>
                    <td className="p-4 align-top text-center"><Star size={20} className={job.isFeatured ? "text-amber-400 fill-amber-400 mx-auto" : "text-slate-300 mx-auto"} /></td>
                    <td className="p-4 align-top text-center text-xs font-bold text-slate-600">{job.unlockCount || 0}</td>
                    <td className="p-4 align-top text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {job.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex justify-center gap-2 flex-wrap max-w-[120px] mx-auto">
                        <ActionBtn text="View" variant="blue" icon={<Eye size={12}/>} onClick={() => handleViewClick(job._id)} />
                        <ActionBtn text="Edit" variant="yellow" onClick={() => handleEditClick(job._id)} />
                        <ActionBtn text="Delete" variant="red" icon={<Trash2 size={12}/>} onClick={() => handleDelete(job._id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      {/* --- View Modal --- */}
      <JobViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} job={selectedJob} loading={fetchLoading} />

      {/* --- NEW Post Job Modal (Create) --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Post New Part-time Job</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Job Title" value={newJob.title} onChange={(v)=>setNewJob({...newJob, title:v})} />
                  <Input label="Company Name" value={newJob.companyName} onChange={(v)=>setNewJob({...newJob, companyName:v})} />
                  <Input label="Location" value={newJob.location} onChange={(v)=>setNewJob({...newJob, location:v})} />
                  <Input label="Vacancies" type="number" value={newJob.vacancies} onChange={(v)=>setNewJob({...newJob, vacancies:v})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Job Role" value={newJob.jobRole} onChange={(v)=>setNewJob({...newJob, jobRole:v, workType:v})} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Min Pay (₹)" type="number" value={newJob.minPay} onChange={(v)=>setNewJob({...newJob, minPay:v})} />
                    <Input label="Max Pay (₹)" type="number" value={newJob.maxPay} onChange={(v)=>setNewJob({...newJob, maxPay:v})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Whatsapp Number" value={newJob.whatsappNumber} onChange={(v)=>setNewJob({...newJob, whatsappNumber:v})} />
                    <Input label="Experience" value={newJob.experience} onChange={(v)=>setNewJob({...newJob, experience:v})} />
                </div>

                <div>
                    <label className="label-text">Job Description</label>
                    <textarea className="input-field min-h-[100px] resize-none" value={newJob.details} onChange={(e) => setNewJob({...newJob, details: e.target.value})} />
                </div>

                <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Input label="Unlock Count" type="number" value={newJob.unlockCount} onChange={(v)=>setNewJob({...newJob, unlockCount:v})} />
                  <div className="flex items-end gap-4 pb-2">
                    <Check label="Featured" checked={newJob.isFeatured} onChange={(v)=>setNewJob({...newJob, isFeatured:v})} />
                    <Check label="Active" checked={newJob.isActive} onChange={(v)=>setNewJob({...newJob, isActive:v})} />
                  </div>
                </div>

                {/* Create Image Upload */}
                <div className="space-y-3">
                    <label className="label-text flex items-center gap-2"><ImageIcon size={14}/> Job Images</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {createImages.map((file, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-200">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New" />
                                <button onClick={() => removeCreateImage(idx)} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-0.5 shadow-md"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => createFileInputRef.current.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-slate-50">
                            <Upload size={20} /> <span className="text-[10px] font-bold mt-1">Upload</span>
                        </button>
                    </div>
                    <input type="file" ref={createFileInputRef} className="hidden" multiple accept="image/*" onChange={handleCreateFileSelect} />
                </div>

                <div className="sticky bottom-0 bg-white pt-4 pb-2 flex justify-end gap-3 border-t border-slate-100">
                  <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-400">Cancel</button>
                  <button onClick={handleCreateNewJob} disabled={saveLoading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100">
                    {saveLoading ? <Loader2 size={16} className="animate-spin" /> : "Post Job Now"}
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Advanced Edit Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Advanced Job Editor</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
            </div>

            {fetchLoading ? (
              <div className="p-20 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600 mb-2" size={30} /><p className="text-sm font-bold text-slate-400">Loading Job Data...</p></div>
            ) : selectedJob && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Job Title" value={selectedJob.title} onChange={(v)=>setSelectedJob({...selectedJob, title:v})} />
                  <Input label="Company Name" value={selectedJob.companyName} onChange={(v)=>setSelectedJob({...selectedJob, companyName:v})} />
                  <Input label="Location" value={selectedJob.location} onChange={(v)=>setSelectedJob({...selectedJob, location:v})} />
                  <Input label="Vacancies" type="number" value={selectedJob.vacancies} onChange={(v)=>setSelectedJob({...selectedJob, vacancies:v})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Job Role" value={selectedJob.jobRole} onChange={(v)=>setSelectedJob({...selectedJob, jobRole:v, workType:v})} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Min Pay (₹)" type="number" value={selectedJob.budget.min} onChange={(v)=>setSelectedJob({...selectedJob, budget:{...selectedJob.budget, min:v}})} />
                    <Input label="Max Pay (₹)" type="number" value={selectedJob.budget.max} onChange={(v)=>setSelectedJob({...selectedJob, budget:{...selectedJob.budget, max:v}})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Whatsapp Number" value={selectedJob.whatsappNumber} onChange={(v)=>setSelectedJob({...selectedJob, whatsappNumber:v})} />
                    <Input label="Experience Required" value={selectedJob.experience} onChange={(v)=>setSelectedJob({...selectedJob, experience:v})} />
                    <Input label="Qualification" className="md:col-span-2" value={selectedJob.qualification} onChange={(v)=>setSelectedJob({...selectedJob, qualification:v})} />
                </div>

                <div>
                    <label className="label-text">Job Description</label>
                    <textarea className="input-field min-h-[100px] resize-none" value={selectedJob.details} onChange={(e) => setSelectedJob({...selectedJob, details: e.target.value})} />
                </div>

                <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Input label="Unlock Count" type="number" value={selectedJob.unlockCount} onChange={(v)=>setSelectedJob({...selectedJob, unlockCount:v})} />
                  <div className="flex items-end gap-4 pb-2">
                    <Check label="Featured" checked={selectedJob.isFeatured} onChange={(v)=>setSelectedJob({...selectedJob, isFeatured:v})} />
                    <Check label="Active Status" checked={selectedJob.isActive} onChange={(v)=>setSelectedJob({...selectedJob, isActive:v})} />
                  </div>
                </div>

                <div className="space-y-3">
                    <label className="label-text flex items-center gap-2"><ImageIcon size={14}/> Media Management</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {selectedJob.existingImages.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-100">
                                <img src={img} className="w-full h-full object-cover" alt="Job" />
                                <button onClick={() => removeExistingImage(img)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={18} /></button>
                            </div>
                        ))}
                        {newImages.map((file, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-200">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" alt="New" />
                                <button onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-0.5 shadow-md"><X size={14} /></button>
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-[8px] text-white text-center py-0.5">NEW</div>
                            </div>
                        ))}
                        <button onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-slate-50">
                            <Upload size={20} /> <span className="text-[10px] font-bold mt-1">Upload</span>
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileSelect} />
                </div>

                <div className="sticky bottom-0 bg-white pt-4 pb-2 flex justify-end gap-3 border-t border-slate-100">
                  <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-400">Cancel</button>
                  <button onClick={handleSaveChanges} disabled={saveLoading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 flex items-center gap-2">
                    {saveLoading ? <Loader2 size={16} className="animate-spin" /> : "Update Everything"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .label-text { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem; }
        .input-field { width: 100%; padding: 0.7rem 1rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; transition: 0.2s; color: #334155; font-size: 0.9rem; font-weight: 500; }
        .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px #3b82f615; background-color: #fff; }
      `}</style>
    </div>
  );
};

const Input = ({ label, type="text", value, onChange, className="" }) => (
  <div className={className}>
    <label className="label-text">{label}</label>
    <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="input-field" />
  </div>
);

const Check = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-blue-600 border-blue-600 shadow-sm' : 'border-slate-300 group-hover:border-blue-400'}`}>
        {checked && <X size={14} className="text-white rotate-45" />}
    </div>
    <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="hidden" />
    <span className="text-xs font-bold text-slate-600">{label}</span>
  </label>
);

const ActionBtn = ({ text, variant, onClick, icon }) => {
  const styles = {
    yellow: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white",
    red: "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white",
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white",
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold rounded-md border transition-all ${styles[variant]}`}>
      {icon} {text}
    </button>
  );
};

export default PartTimeJobManagement;