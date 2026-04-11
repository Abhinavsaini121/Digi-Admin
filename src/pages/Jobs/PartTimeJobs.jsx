import React, { useState, useEffect, useMemo, useRef } from "react";
import { AlertCircle, X, Star, Trash2, PlusCircle, Loader2, Eye, Upload, Image as ImageIcon, User, MapPin, MessageSquare, Navigation, AlignLeft, Phone, Calendar, Briefcase, IndianRupee } from "lucide-react";
import { getAllJobs, getJobById, updateJob, deleteJob, createNewJob, getAllUsersAPI } from "../../auth/adminLogin";
import toast, { Toaster } from "react-hot-toast";

// Aapki Google API Key (Optional)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// --- VIEW MODAL COMPONENT ---
const JobViewModal = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Job Details</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Images Section */}
          {job.images && job.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {job.images.map((img, idx) => (
                <img key={idx} src={img} alt="Job" className="w-full h-32 object-cover rounded-xl border" />
              ))}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {job.jobCategory}
              </span>
              {job.isFeatured && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><Star size={10} fill="currentColor" /> FEATURED</span>}
            </div>
            <h1 className="text-2xl font-black text-slate-900">{job.title}</h1>
            <p className="text-slate-500 font-medium flex items-center gap-1 mt-1"><MapPin size={14} /> {job.location?.address || "No address provided"}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100">
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Salary Range</p>
              <p className="text-sm font-bold text-slate-800">₹{job.salaryRange?.min} - {job.salaryRange?.max}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Vacancies</p>
              <p className="text-sm font-bold text-slate-800">{job.vacancies} Posts</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Experience</p>
              <p className="text-sm font-bold text-slate-800">{job.experience}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Qualification</p>
              <p className="text-sm font-bold text-slate-800">{job.qualification}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2"><AlignLeft size={16} /> Job Description</h4>
              <div className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {job.details || "No detailed description available."}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Company Info</p>
                <p className="text-sm font-bold text-slate-800">{job.companyName || "N/A"}</p>
                <p className="text-xs text-blue-600 font-medium mt-1 uppercase">{job.jobRole}</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Contact Preference</p>
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Phone size={14} /> <span>{job.whatsappNumber || "No Number"}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Method: {job.preferredCommunication?.join(", ") || "WhatsApp"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button onClick={onClose} className="bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const PartTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locLoading, setLocLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [createImages, setCreateImages] = useState([]);
  const [editNewImages, setEditNewImages] = useState([]); // Specifically for adding images during edit

  const createFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const initialJobState = {
    userId: "",
    title: "",
    description: "",
    companyName: "",
    jobRole: "",
    vacancies: 5,
    minPay: "",
    maxPay: "",
    details: "",
    whatsappNumber: "",
    experience: "Fresher",
    qualification: "10th Pass",
    address: "",
    latitude: "19.0760",
    longitude: "72.8777",
    status: "active",
    isFeatured: false,
    preferredCommunication: ["WhatsApp"]
  };

  const [newJob, setNewJob] = useState(initialJobState);

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs();
      console.log("Full API Response:", response); // Isse check karein ki data ka array kahan hai
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
      job.jobCategory?.toLowerCase().replace('_', '-').includes("part-time")
    );
  }, [allJobs]);
  // Handle Location Fetch for both Create & Edit
  const handleFetchLocation = (type) => {
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
          const address = osmData.display_name || "Location Found";

          if (type === 'create') {
            setNewJob(prev => ({ ...prev, latitude, longitude, address }));
          } else {
            setSelectedJob(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address,
                coordinates: [longitude, latitude]
              }
            }));
          }
          toast.success("Location updated!");
        } catch (error) {
          toast.error("Error resolving address");
        } finally {
          setLocLoading(false);
        }
      },
      () => { toast.error("Location permission denied"); setLocLoading(false); }
    );
  };

  const handleCreateNewJob = async () => {
    if (!newJob.userId) return toast.error("Select a User first!");
    if (!newJob.title?.trim()) return toast.error("Job Title is required!");
    if (!newJob.details?.trim()) return toast.error("Full Job details are required!");

    try {
      setSaveLoading(true);
      const formData = new FormData();
      formData.append("userId", newJob.userId);
      formData.append("jobCategory", "PART_TIME_JOB");
      formData.append("title", newJob.title);
      formData.append("description", newJob.description || "N/A");
      formData.append("details", newJob.details);
      formData.append("companyName", newJob.companyName || "N/A");
      formData.append("jobRole", newJob.jobRole || "N/A");
      formData.append("vacancies", newJob.vacancies);
      formData.append("whatsappNumber", newJob.whatsappNumber);
      formData.append("experience", newJob.experience);
      formData.append("qualification", newJob.qualification);
      formData.append("status", "active");
      formData.append("isFeatured", String(newJob.isFeatured));
      formData.append("salaryRange[min]", newJob.minPay);
      formData.append("salaryRange[max]", newJob.maxPay);
      formData.append("location[type]", "Point");
      formData.append("location[address]", newJob.address);
      formData.append("location[coordinates][0]", newJob.longitude);
      formData.append("location[coordinates][1]", newJob.latitude);

      createImages.forEach((file) => formData.append("images", file));

      const response = await createNewJob(formData);
      if (response.success) {
        toast.success("Job posted!");
        setIsCreateModalOpen(false);
        setNewJob(initialJobState);
        setCreateImages([]);
        fetchData();
      }
    } catch (err) {
      toast.error("Submission Error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateJob = async () => {
    try {
      setSaveLoading(true);
      const formData = new FormData();
      formData.append("title", selectedJob.title);
      formData.append("description", selectedJob.description || "");
      formData.append("details", selectedJob.details);
      formData.append("companyName", selectedJob.companyName);
      formData.append("jobRole", selectedJob.jobRole);
      formData.append("vacancies", selectedJob.vacancies);
      formData.append("experience", selectedJob.experience);
      formData.append("qualification", selectedJob.qualification);
      formData.append("whatsappNumber", selectedJob.whatsappNumber);
      formData.append("isFeatured", String(selectedJob.isFeatured));
      formData.append("salaryRange[min]", selectedJob.salaryRange?.min);
      formData.append("salaryRange[max]", selectedJob.salaryRange?.max);

      formData.append("location[address]", selectedJob.location?.address);
      formData.append("location[type]", "Point");
      formData.append("location[coordinates][0]", selectedJob.location?.coordinates[0]);
      formData.append("location[coordinates][1]", selectedJob.location?.coordinates[1]);

      // If new images were selected during edit
      if (editNewImages && editNewImages.length > 0) {
        editNewImages.forEach(file => {
          if (file instanceof File) { // Sirf tabhi append karein agar ye actual file hai
            formData.append("images", file);
          }
        });
      }

      const response = await updateJob(selectedJob._id, formData);
      if (response.success) {
        toast.success("Job updated successfully!");
        setIsEditModalOpen(false);
        setEditNewImages([]);
        fetchData();
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaveLoading(false);
    }
  };

  const openEditModal = (job) => {
    // Mapping all nested and non-nested data properly to avoid UI blanks
    setSelectedJob({
      ...job,
      experience: job.experience || "Fresher",
      qualification: job.qualification || "10th Pass",
      whatsappNumber: job.whatsappNumber || "",
      location: {
        address: job.location?.address || "",
        coordinates: job.location?.coordinates || [72.8777, 19.0760],
        type: "Point"
      },
      salaryRange: {
        min: job.salaryRange?.min || "",
        max: job.salaryRange?.max || ""
      }
    });
    setEditNewImages([]);
    setIsEditModalOpen(true);
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
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Featured</th>
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
                  <td className="p-4 font-bold text-slate-700 text-sm">₹{job.salaryRange?.min} - {job.salaryRange?.max}</td>
                  <td className="p-4 text-center"><Star size={18} className={job.isFeatured ? "text-amber-400 fill-amber-400 mx-auto" : "text-slate-300 mx-auto"} /></td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <ActionBtn text="View" variant="blue" icon={<Eye size={12} />} onClick={() => { setSelectedJob(job); setIsViewModalOpen(true) }} />
                      <ActionBtn text="Delete" variant="red" icon={<Trash2 size={12} />} onClick={async () => { if (window.confirm("Delete?")) { await deleteJob(job._id); fetchData(); } }} />
                      <ActionBtn text="Edit" variant="blue" icon={<PlusCircle size={12} />} onClick={() => openEditModal(job)} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-text flex items-center gap-1"><User size={12} /> Select Job Poster (User)*</label>
                  <select className="input-field" value={newJob.userId} onChange={(e) => setNewJob({ ...newJob, userId: e.target.value })}>
                    <option value="">Choose a user...</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.fullName || u.mobile} ({u.role})</option>)}
                  </select>
                </div>
                <Input label="Job Title*" value={newJob.title} onChange={(v) => setNewJob({ ...newJob, title: v })} />
                <Input label="Short Description*" value={newJob.description} onChange={(v) => setNewJob({ ...newJob, description: v })} />
              </div>

              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-[10px] uppercase"><MapPin size={14} /> Job Location</div>
                  <button type="button" onClick={() => handleFetchLocation('create')} disabled={locLoading} className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    {locLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />} Fetch Location
                  </button>
                </div>
                <Input label="Full Address*" value={newJob.address} onChange={(v) => setNewJob({ ...newJob, address: v })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" value={newJob.latitude} onChange={(v) => setNewJob({ ...newJob, latitude: v })} />
                  <Input label="Longitude" value={newJob.longitude} onChange={(v) => setNewJob({ ...newJob, longitude: v })} />
                </div>
              </div>

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
                <textarea className="input-field min-h-[100px]" placeholder="Requirements..." value={newJob.details} onChange={(e) => setNewJob({ ...newJob, details: e.target.value })} />
              </div>

              <div className="space-y-3">
                <label className="label-text flex items-center justify-between"><span><ImageIcon size={14} /> Job Images (Max 5)</span></label>
                <div className="grid grid-cols-5 gap-3">
                  {createImages.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => setCreateImages(createImages.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-0.5"><X size={12} /></button>
                    </div>
                  ))}
                  {createImages.length < 5 && (
                    <button onClick={() => createFileInputRef.current.click()} className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400"><PlusCircle size={24} /></button>
                  )}
                </div>
                <input type="file" ref={createFileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => setCreateImages([...createImages, ...Array.from(e.target.files)])} />
              </div>

              <div className="sticky bottom-0 bg-white pt-4 pb-2 flex justify-end gap-3 border-t">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-400">Cancel</button>
                <button onClick={handleCreateNewJob} disabled={saveLoading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
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
              {/* Image Management in Edit */}
              <div>
                <label className="label-text">Current & New Images</label>
                <div className="grid grid-cols-5 gap-3 mt-2">
                  {/* Existing Images from API */}
                  {selectedJob.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-blue-200">
                      <img src={img} className="w-full h-full object-cover" alt="Existing" />
                      <div className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] px-1 rounded font-bold">LIVE</div>
                    </div>
                  ))}
                  {/* New images picked during edit */}
                  {editNewImages.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-green-200">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New" />
                      <button onClick={() => setEditNewImages(editNewImages.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-0.5"><X size={10} /></button>
                    </div>
                  ))}
                  {(selectedJob.images?.length || 0) + editNewImages.length < 5 && (
                    <button onClick={() => editFileInputRef.current.click()} className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400 hover:border-blue-400">
                      <PlusCircle size={24} />
                    </button>
                  )}
                </div>
                <input type="file" ref={editFileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => setEditNewImages([...editNewImages, ...Array.from(e.target.files)])} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Job Title" value={selectedJob.title} onChange={(v) => setSelectedJob({ ...selectedJob, title: v })} />
                <Input label="Short Description" value={selectedJob.description} onChange={(v) => setSelectedJob({ ...selectedJob, description: v })} />
              </div>

              {/* Location Section in Edit */}
              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="label-text text-blue-700 font-bold">Job Location</label>
                  <button onClick={() => handleFetchLocation('edit')} disabled={locLoading} className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                    {locLoading ? <Loader2 size={10} className="animate-spin" /> : <Navigation size={10} />} Update Current
                  </button>
                </div>
                <Input label="Full Address" value={selectedJob.location?.address} onChange={(v) => setSelectedJob({ ...selectedJob, location: { ...selectedJob.location, address: v } })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Longitude" value={selectedJob.location?.coordinates[0]} onChange={(v) => setSelectedJob({ ...selectedJob, location: { ...selectedJob.location, coordinates: [v, selectedJob.location.coordinates[1]] } })} />
                  <Input label="Latitude" value={selectedJob.location?.coordinates[1]} onChange={(v) => setSelectedJob({ ...selectedJob, location: { ...selectedJob.location, coordinates: [selectedJob.location.coordinates[0], v] } })} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="label-text">Experience</label>
                  <select className="input-field" value={selectedJob.experience} onChange={(e) => setSelectedJob({ ...selectedJob, experience: e.target.value })}>
                    <option value="Fresher">Fresher</option>
                    <option value="1+ Year">1+ Year</option>
                    <option value="2+ Year">2+ Year</option>
                    <option value="5+ Year">5+ Year</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="label-text">Qualification</label>
                  <select className="input-field" value={selectedJob.qualification} onChange={(e) => setSelectedJob({ ...selectedJob, qualification: e.target.value })}>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="editFeat" checked={selectedJob.isFeatured} onChange={(e) => setSelectedJob({ ...selectedJob, isFeatured: e.target.checked })} />
                <label htmlFor="editFeat" className="text-sm font-bold text-slate-700">Mark as Featured Job</label>
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

      {/* VIEW MODAL */}
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
    <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="input-field" />
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