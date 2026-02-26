import React, { useState, useEffect, useMemo, useRef } from "react";
import { AlertCircle, X, Star, Trash2, PlusCircle, Loader2, Eye, Upload, Image as ImageIcon, User, MapPin, MessageSquare, Navigation, AlignLeft } from "lucide-react";
import { getAllJobs, getJobById, updateJob, deleteJob, createNewJob, getAllUsersAPI } from "../../auth/adminLogin";
import toast, { Toaster } from "react-hot-toast";
import JobViewModal from "./JobDetailsModal";

// Aapki Google API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyB25eeQ2I_NTGDM9ybfnLXvc6PIerCsK3I";

const PartTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locLoading, setLocLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [createImages, setCreateImages] = useState([]);

  const createFileInputRef = useRef(null);

  const initialJobState = {
    userId: "",
    title: "",
    description: "", // Short Description
    companyName: "",
    jobRole: "",
    vacancies: 5,
    minPay: "",
    maxPay: "",
    details: "", // Full Job description
    whatsappNumber: "",
    experience: "Fresher",
    qualification: "10th Pass",
    address: "",
    latitude: "19.0760", // Default (Mumbai) ya empty string ko handle karenge
    longitude: "72.8777", // Default (Mumbai)
    status: "active",
    isFeatured: false,
    preferredCommunication: ["WhatsApp"]
  };

  const [newJob, setNewJob] = useState(initialJobState);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs();
      setAllJobs(response.data || []);
    } catch (err) {
      toast.error("Error fetching job list");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersAPI();
      if (response.success) setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) =>
      job.jobCategory?.toLowerCase().includes("part-time")
    );
  }, [allJobs]);

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const osmData = await osmRes.json();

          setNewJob(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            address: osmData.display_name || "Location Found"
          }));
          toast.success("Location fetched!");
        } catch (error) {
          toast.error("Error resolving address");
        } finally {
          setLocLoading(false);
        }
      },
      () => { toast.error("Location permission denied"); setLocLoading(false); }
    );
  };

  const handleCreateFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (createImages.length + files.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }
    setCreateImages(prev => [...prev, ...files]);
  };

  // --- SUBMIT FUNCTION WITH FIXES ---
  const handleCreateNewJob = async () => {
    // 1. Validation check (ensure values are not empty)
    if (!newJob.userId) return toast.error("Select a User first!");
    if (!newJob.title.trim()) return toast.error("Job Title is required!");
    if (!newJob.details.trim()) return toast.error("Full Job details are required!");
    if (!newJob.minPay || !newJob.maxPay) return toast.error("Salary range is required!");
    if (!newJob.address.trim()) return toast.error("Address is required!");

    try {
      setSaveLoading(true);
      const formData = new FormData();

      // Basic Fields
      formData.append("userId", newJob.userId);
      formData.append("jobCategory", "Part-time job");
      formData.append("title", newJob.title.trim());
      formData.append("description", newJob.description.trim());
      formData.append("details", newJob.details.trim());
      formData.append("companyName", newJob.companyName || "N/A");
      formData.append("jobRole", newJob.jobRole || "N/A");
      formData.append("vacancies", Number(newJob.vacancies) || 1);
      formData.append("whatsappNumber", newJob.whatsappNumber || "");
      formData.append("experience", newJob.experience);
      formData.append("qualification", newJob.qualification);
      formData.append("status", newJob.status);
      formData.append("isFeatured", String(newJob.isFeatured)); // Boolean ko string mein bhejein

      // Important: Preferred Communication (Backend array expect kar raha hai)
      formData.append("preferredCommunication[0]", "WhatsApp");

      // Salary Object
      formData.append("salaryRange[min]", Number(newJob.minPay));
      formData.append("salaryRange[max]", Number(newJob.maxPay));

      // --- LOCATION FIX ---
      // parseFloat agar fail ho jaye to default value (Mumbai coordinates) dein
      const lng = parseFloat(newJob.longitude);
      const lat = parseFloat(newJob.latitude);

      const finalLng = isNaN(lng) ? 72.8777 : lng;
      const finalLat = isNaN(lat) ? 19.0760 : lat;

      formData.append("location[address]", newJob.address.trim());
      formData.append("location[type]", "Point");
      // Alag-alag index par append karein
      formData.append("location[coordinates][0]", finalLng);
      formData.append("location[coordinates][1]", finalLat);

      // Images
      if (createImages.length > 0) {
        createImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Debugging ke liye: Console mein check karein kya data ja raha hai
      // for (let pair of formData.entries()) { console.log(pair[0] + ': ' + pair[1]); }

      const response = await createNewJob(formData);

      if (response.success) {
        toast.success("Job posted successfully!");
        setIsCreateModalOpen(false);
        setNewJob(initialJobState);
        setCreateImages([]);
        fetchData();
      }
    } catch (err) {
      console.error("Full Error Object:", err);
      const errMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateJob = async () => {
    try {
      setSaveLoading(true);
      const formData = new FormData();

      // Data append karein (exactly same as create, but from selectedJob)
      formData.append("title", selectedJob.title);
      formData.append("description", selectedJob.description);
      formData.append("details", selectedJob.details);
      formData.append("companyName", selectedJob.companyName);
      formData.append("jobRole", selectedJob.jobRole);
      formData.append("vacancies", selectedJob.vacancies);
      formData.append("salaryRange[min]", selectedJob.salaryRange?.min);
      formData.append("salaryRange[max]", selectedJob.salaryRange?.max);
      formData.append("location[address]", selectedJob.location?.address);
      // ... baki fields bhi add karein

      const response = await updateJob(selectedJob._id, formData);
      if (response.success) {
        toast.success("Job updated!");
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Part-time Job Management</h1>
          <p className="text-slate-500 text-sm">Create and manage your part-time listings</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2"
        >
          <PlusCircle size={18} />Post New Job
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job Details</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Salary</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center text-center">Featured</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
              ) : filteredJobs.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-slate-400">No jobs found.</td></tr>
              ) : filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <img src={job.images?.[0] || "https://placehold.co/150"} className="w-10 h-10 rounded-lg object-cover border" alt="job" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{job.title}</div>
                        <div className="text-[10px] text-blue-600 font-bold uppercase">{job.jobRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700 text-sm">₹{job.salaryRange?.min} - ₹{job.salaryRange?.max}</td>
                  <td className="p-4 text-center"><Star size={18} className={job.isFeatured ? "text-amber-400 fill-amber-400 mx-auto" : "text-slate-300 mx-auto"} /></td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <ActionBtn text="View" variant="blue" icon={<Eye size={12} />} onClick={() => { setSelectedJob(job); setIsViewModalOpen(true) }} />
                      <ActionBtn text="Delete" variant="red" icon={<Trash2 size={12} />} onClick={async () => { if (window.confirm("Delete?")) { await deleteJob(job._id); fetchData(); } }} />
                      <ActionBtn
                        text="Edit"
                        variant="blue"
                        icon={<PlusCircle size={12} />}
                        onClick={() => {
                          setSelectedJob(job);
                          setIsEditModalOpen(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE JOB MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-800">Post New Part-time Job</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* User & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-text flex items-center gap-1"><User size={12} /> Select Job Poster (User)*</label>
                  <select className="input-field" value={newJob.userId} onChange={(e) => setNewJob({ ...newJob, userId: e.target.value })}>
                    <option value="">Choose a user...</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.fullName} ({u.mobile})</option>)}
                  </select>
                </div>
                <Input label="Job Title*" value={newJob.title} onChange={(v) => setNewJob({ ...newJob, title: v })} />
                <Input label="Short Description*" value={newJob.description} onChange={(v) => setNewJob({ ...newJob, description: v })} />
              </div>

              {/* Location Section */}
              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-[10px] uppercase"><MapPin size={14} /> Job Location</div>
                  <button type="button" onClick={handleFetchLocation} disabled={locLoading} className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    {locLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />} Fetch Location
                  </button>
                </div>
                <Input label="Full Address*" value={newJob.address} onChange={(v) => setNewJob({ ...newJob, address: v })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" value={newJob.latitude} onChange={(v) => setNewJob({ ...newJob, latitude: v })} />
                  <Input label="Longitude" value={newJob.longitude} onChange={(v) => setNewJob({ ...newJob, longitude: v })} />
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company Name" value={newJob.companyName} onChange={(v) => setNewJob({ ...newJob, companyName: v })} />
                <Input label="Job Role" value={newJob.jobRole} onChange={(v) => setNewJob({ ...newJob, jobRole: v })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Min Pay (₹)*" type="number" value={newJob.minPay} onChange={(v) => setNewJob({ ...newJob, minPay: v })} />
                  <Input label="Max Pay (₹)*" type="number" value={newJob.maxPay} onChange={(v) => setNewJob({ ...newJob, maxPay: v })} />
                </div>
                <Input label="Vacancies" type="number" value={newJob.vacancies} onChange={(v) => setNewJob({ ...newJob, vacancies: v })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Whatsapp Number" value={newJob.whatsappNumber} onChange={(v) => setNewJob({ ...newJob, whatsappNumber: v })} />
                <div className="space-y-1">
                  <label className="label-text">Experience</label>
                  <select className="input-field" value={newJob.experience} onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}>
                    <option value="Fresher">Fresher</option>
                    <option value="1+ Year">1+ Year</option>
                    <option value="2+ Year">2+ Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text">Full Job Details/Description*</label>

                <textarea
                  className="input-field"
                  value={newJob.details}
                  onChange={(e) => setNewJob({ ...newJob, details: e.target.value })}
                />
              </div>

              {/* Images Section */}
              <div className="space-y-3">
                <label className="label-text flex items-center justify-between">
                  <span><ImageIcon size={14} /> Job Images (Max 5)</span>
                  <span className="text-[10px]">{createImages.length} / 5</span>
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {createImages.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => setCreateImages(createImages.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-0.5"><X size={12} /></button>
                    </div>
                  ))}
                  {createImages.length < 5 && (
                    <button type="button" onClick={() => createFileInputRef.current.click()} className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400 hover:border-blue-400">
                      <PlusCircle size={24} />
                    </button>
                  )}
                </div>
                <input type="file" ref={createFileInputRef} className="hidden" multiple accept="image/*" onChange={handleCreateFileSelect} />
              </div>

              {/* Footer Buttons */}
              <div className="sticky bottom-0 bg-white pt-4 pb-2 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-400">Cancel</button>
                <button type="button" onClick={handleCreateNewJob} disabled={saveLoading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50">
                  {saveLoading ? <Loader2 size={16} className="animate-spin" /> : "Post Job Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* EDIT JOB MODAL */}
      {isEditModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-slate-800">Edit Part-time Job</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Selection (Read Only typically) */}
              <div className="md:col-span-2">
                <label className="label-text">Job Poster (User)</label>
                <input className="input-field bg-slate-100" value={selectedJob.userId?.fullName || "Assigned User"} readOnly />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Job Title" value={selectedJob.title} onChange={(v) => setSelectedJob({ ...selectedJob, title: v })} />
                <Input label="Short Description" value={selectedJob.description} onChange={(v) => setSelectedJob({ ...selectedJob, description: v })} />
              </div>

              {/* Location */}
              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <label className="label-text text-blue-700">Job Location</label>
                <Input label="Full Address" value={selectedJob.location?.address} onChange={(v) => setSelectedJob({ ...selectedJob, location: { ...selectedJob.location, address: v } })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" value={selectedJob.location?.coordinates?.[1]} onChange={(v) => { }} />
                  <Input label="Longitude" value={selectedJob.location?.coordinates?.[0]} onChange={(v) => { }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company Name" value={selectedJob.companyName} onChange={(v) => setSelectedJob({ ...selectedJob, companyName: v })} />
                <Input label="Job Role" value={selectedJob.jobRole} onChange={(v) => setSelectedJob({ ...selectedJob, jobRole: v })} />
                <Input label="Min Pay (₹)" value={selectedJob.salaryRange?.min} onChange={(v) => setSelectedJob({ ...selectedJob, salaryRange: { ...selectedJob.salaryRange, min: v } })} />
                <Input label="Max Pay (₹)" value={selectedJob.salaryRange?.max} onChange={(v) => setSelectedJob({ ...selectedJob, salaryRange: { ...selectedJob.salaryRange, max: v } })} />
                <Input label="Vacancies" value={selectedJob.vacancies} onChange={(v) => setSelectedJob({ ...selectedJob, vacancies: v })} />
                <Input label="Whatsapp Number" value={selectedJob.whatsappNumber} onChange={(v) => setSelectedJob({ ...selectedJob, whatsappNumber: v })} />
              </div>

              <div>
                <label className="label-text">Experience</label>
                <select className="input-field" value={selectedJob.experience} onChange={(e) => setSelectedJob({ ...selectedJob, experience: e.target.value })}>
                  <option value="Fresher">Fresher</option>
                  <option value="1+ Year">1+ Year</option>
                  <option value="2+ Year">2+ Year</option>
                </select>
              </div>

              <div>
                <label className="label-text">Full Job Details/Description*</label>
                <textarea className="input-field h-32" value={selectedJob.details} onChange={(e) => setSelectedJob({ ...selectedJob, details: e.target.value })} />
              </div>

              <div className="sticky bottom-0 bg-white pt-4 pb-2 flex justify-end gap-3 border-t">
                <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-400">Cancel</button>
                <button onClick={handleUpdateJob} disabled={saveLoading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg">
                  {saveLoading ? <Loader2 size={16} className="animate-spin" /> : "Update Job Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <JobViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} job={selectedJob} />

      <style>{`
        .label-text { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem; }
        .input-field { width: 100%; padding: 0.7rem 1rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; transition: 0.2s; color: #334155; font-size: 0.9rem; }
        .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px #3b82f615; background-color: #fff; }
      `}</style>
    </div>
  );
};

// Helper Components
const Input = ({ label, type = "text", value, onChange }) => (
  <div className="w-full">
    <label className="label-text">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
  </div>
);

const ActionBtn = ({ text, variant, onClick, icon }) => {
  const styles = {
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