import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Loader2, AlertCircle, X, Star, CheckCircle, Plus,
  ChevronDown, Upload, MapPin, Briefcase, IndianRupee,
  Users, GraduationCap, Phone, Info, Layout, Navigation, FileText
} from "lucide-react";
import { getAllFullTimeJobs, createNewFullTimeJob, getAllUsersAPI } from "../../auth/adminLogin";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const normalizeJobData = (job) => {
  if (!job) return null;
  const salary = job.salaryRange || {};
  return {
    _id: job._id || Math.random().toString(),
    title: job.title || "Untitled Job",
    companyName: job.companyName || 'Individual',
    location: job.location?.address || "Location Not Set",
    jobRole: job.jobRole || "Not Specified",
    budget: {
      min: salary.min || 0,
      max: salary.max || 0
    },
    isFeatured: !!job.isFeatured,
    isActive: job.status === 'active',
  };
};

const FullTimeJobManagement = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const initialNewJobForm = {
    userId: "",
    title: "",
    companyName: "",
    description: "",
    details: "", // Image wala 'details' field
    jobRole: "",
    vacancies: "",
    whatsappNumber: "",
    experience: "",
    qualification: "",
    salaryMin: "",
    salaryMax: "",
    address: "",
    lng: import.meta.env.VITE_DEFAULT_LNG || "77.2090",
    lat: import.meta.env.VITE_DEFAULT_LAT || "28.6139",
    images: null,
  };

  const [newJobForm, setNewJobForm] = useState(initialNewJobForm);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersAPI();
        setUsersList(Array.isArray(response?.data) ? response.data : []);
      } catch (err) { console.error(err); }
    };
    fetchUsers();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllFullTimeJobs();
      const jobsArray = Array.isArray(response?.data) ? response.data : [];
      setAllJobs(jobsArray.map(normalizeJobData).filter(Boolean));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJobForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewJobForm(prev => ({ ...prev, images: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAutoFetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setNewJobForm(prev => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6)
        }));

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.status === "OK" && data.results[0]) {
            setNewJobForm(prev => ({ ...prev, address: data.results[0].formatted_address }));
          } else {
            alert("Coordinates fetched! Please enter address manually.");
          }
        } catch (error) {
          alert("Failed to get address. Please type it manually.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        alert("Location access denied. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleNewJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJobForm.userId) {
      alert("Please select a posting user");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    if (newJobForm.images) {
      formData.append('images', newJobForm.images);
    }

    formData.append('title', newJobForm.title);
    formData.append('description', newJobForm.description);
    formData.append('companyName', newJobForm.companyName);
    formData.append('details', newJobForm.details); // Adding Details here
    formData.append('salaryRange', JSON.stringify({ min: Number(newJobForm.salaryMin), max: Number(newJobForm.salaryMax) }));
    formData.append('jobRole', newJobForm.jobRole);
    formData.append('vacancies', newJobForm.vacancies);
    formData.append('whatsappNumber', newJobForm.whatsappNumber);
    formData.append('experience', newJobForm.experience);
    formData.append('qualification', newJobForm.qualification);
    formData.append('location[coordinates][0]', newJobForm.lng);
    formData.append('location[coordinates][1]', newJobForm.lat);
    formData.append('location[address]', newJobForm.address);
    formData.append('userId', newJobForm.userId);

    try {
      await createNewFullTimeJob(formData);
      await fetchJobs();
      setIsAddModalOpen(false);
      setNewJobForm(initialNewJobForm);
      setImagePreview(null);
      setIsSuccessModalOpen(true);
    } catch (err) {
      alert(err.message || "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ icon: Icon, label, ...props }) => (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 ml-1">
        {Icon && <Icon size={12} />} {label}
      </label>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Job Board</h1>
          <p className="text-slate-500 text-sm">Manage and post full-time opportunities</p>
        </div>
        <button
          onClick={() => { setNewJobForm(initialNewJobForm); setIsAddModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Loading records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Role & Company</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Category</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Featured</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allJobs.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-slate-400">No jobs found.</td></tr>
              ) : (
                allJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{job.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><Briefcase size={12} /> {job.companyName}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">{job.jobRole}</span>
                    </td>
                    <td className="p-4 text-center">
                      <Star size={18} className="mx-auto" fill={job.isFeatured ? "#fbbf24" : "none"} color={job.isFeatured ? "#fbbf24" : "#cbd5e1"} />
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${job.isActive ? 'text-emerald-500 bg-emerald-50' : 'text-red-400 bg-red-50'}`}>
                        {job.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 font-bold text-xs hover:underline">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD JOB MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-2xl text-slate-800 flex items-center gap-2">
                <Layout className="text-blue-600" /> Create Full-Time Listing
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleNewJobSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Users size={12} /> Posting User ID
                  </label>
                  <div
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="border border-slate-200 bg-slate-50 p-2.5 rounded-lg flex justify-between items-center cursor-pointer text-sm"
                  >
                    <span>{usersList.find(u => u._id === newJobForm.userId)?.fullName || "Select User"}</span>
                    <ChevronDown size={16} />
                  </div>
                  {isUserDropdownOpen && (
                    <div className="absolute z-[100] w-full bg-white border border-slate-100 mt-1 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                      {usersList.map((u) => (
                        <div key={u._id} onClick={() => { setNewJobForm({ ...newJobForm, userId: u._id }); setIsUserDropdownOpen(false); }} className="p-3 hover:bg-blue-50 cursor-pointer border-b text-xs flex flex-col">
                          <span className="font-bold">{u.fullName}</span>
                          <span className="text-slate-400">{u._id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <InputField label="Company Name" name="companyName" icon={Briefcase} placeholder="Tech Solutions Ltd" required value={newJobForm.companyName} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <InputField label="Job Title" name="title" icon={Info} placeholder="Senior Software Engineer" required value={newJobForm.title} onChange={handleInputChange} />
                </div>
                <InputField label="Job Role" name="jobRole" icon={Layout} placeholder="Developer" required value={newJobForm.jobRole} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <InputField label="Min Salary" name="salaryMin" icon={IndianRupee} type="number" required value={newJobForm.salaryMin} onChange={handleInputChange} />
                <InputField label="Max Salary" name="salaryMax" icon={IndianRupee} type="number" required value={newJobForm.salaryMax} onChange={handleInputChange} />
                <InputField label="Experience" name="experience" icon={Briefcase} placeholder="3-5 Years" required value={newJobForm.experience} onChange={handleInputChange} />
                <InputField label="Vacancies" name="vacancies" icon={Users} type="number" placeholder="5" required value={newJobForm.vacancies} onChange={handleInputChange} />
              </div>

              {/* LOCATION SECTION */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Location Details
                  </h3>
                  <button
                    type="button"
                    onClick={handleAutoFetchLocation}
                    disabled={isFetchingLocation}
                    className="flex items-center gap-1.5 bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                  >
                    {isFetchingLocation ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                    {isFetchingLocation ? "Fetching..." : "Auto-fetch (No API Key needed)"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <InputField label="Full Address" name="address" placeholder="New Delhi, India" required value={newJobForm.address} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="Longitude" name="lng" required value={newJobForm.lng} onChange={handleInputChange} />
                    <InputField label="Latitude" name="lat" required value={newJobForm.lat} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Qualification" name="qualification" icon={GraduationCap} placeholder="B.Tech / MCA" required value={newJobForm.qualification} onChange={handleInputChange} />
                <InputField label="WhatsApp Number" name="whatsappNumber" icon={Phone} placeholder="9123456789" required value={newJobForm.whatsappNumber} onChange={handleInputChange} />
              </div>

              {/* DESCRIPTION & DETAILS (Both from image added here) */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Info size={12} /> Short Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Full-time role for MERN stack developer."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 outline-none focus:ring-2 focus:ring-blue-500"
                    required value={newJobForm.description} onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <FileText size={12} /> Full Role Details (Benefits, Timing, etc.)
                  </label>
                  <textarea
                    name="details"
                    placeholder="Full details about the role, benefits, and timing."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm h-32 outline-none focus:ring-2 focus:ring-blue-500"
                    required value={newJobForm.details} onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="h-40 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <p className="text-white text-xs font-bold">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-slate-100 p-3 rounded-full inline-block mb-2 text-slate-400">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Upload Job Banner (Images)</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">JPG, PNG up to 5MB</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl transition-all hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                {isSubmitting ? "PUBLISHING..." : "PUBLISH JOB NOW"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[32px] text-center shadow-2xl max-w-xs w-full animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-500" size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Live Now!</h2>
            <p className="text-slate-500 text-sm mb-8">Your job listing has been successfully posted.</p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default FullTimeJobManagement;