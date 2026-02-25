import React, { useState, useEffect } from "react";
import { CheckCircle, X, User, Info, Phone, AlertCircle, Upload, Pencil, ImageIcon, Loader2 } from 'lucide-react';

// अपनी API फाइल का सही पथ (Path) यहाँ इंपोर्ट करें
import { updateBusinessDetailsAPI } from "../../auth/adminLogin"; 

const ShopEditForm = ({ shopData, users, categories, onClose }) => {

  // --- State Initialization ---
  const [editFormData, setEditFormData] = useState({
    userId: shopData?.userId?._id || shopData?.userId || "", 
    businessName: shopData?.businessName || "",
    details: shopData?.details || "",
    category: shopData?.category || "",
    location: shopData?.location || "",
    address: shopData?.address || "",
    ownerName: shopData?.ownerName || "",
    mobileNumber: shopData?.mobileNumber || "",
    whatsappNumber: shopData?.whatsappNumber || "",
  });
  
  const [formFiles, setFormFiles] = useState({
    businessImages: [], 
    nationalIdImage: null, 
    ownerImage: null, 
  });

  const [previews, setPreviews] = useState({
    businessImages: [],
    nationalIdImage: null,
    ownerImage: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback state for Popup
  const [feedback, setFeedback] = useState({ show: false, message: "", type: "success" });

  // --- Cleanup Previews on Unmount ---
  useEffect(() => {
    return () => {
        if (previews.nationalIdImage) URL.revokeObjectURL(previews.nationalIdImage);
        if (previews.ownerImage) URL.revokeObjectURL(previews.ownerImage);
        previews.businessImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const showPopupMessage = (message, type = "success") => {
    setFeedback({ show: true, message, type });
    // Success hone par 2 second baad msg hatega aur modal close hoga
    if (type === 'success') {
        setTimeout(() => {
            setFeedback({ show: false, message: "", type: "success" });
            if(onClose) onClose(); // Modal Close Trigger
        }, 1500);
    } else {
        // Error hone par 3 sec baad msg hatega
        setTimeout(() => setFeedback({ show: false, message: "", type: "success" }), 3000);
    }
  };

  // --- Handle Text Changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") {
        const selectedUserData = users.find(u => u._id === value);
        const autoName = selectedUserData ? (selectedUserData.fullName || selectedUserData.name || "") : "";
        setEditFormData(prev => ({ ...prev, userId: value, ownerName: autoName }));
    } else {
        setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- Handle File Changes ---
  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (field === "businessImages") {
      const newFiles = Array.from(files);
      setFormFiles(prev => ({ ...prev, [field]: newFiles }));
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => ({ ...prev, [field]: newPreviews }));
    } else {
      const file = files[0];
      setFormFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  // --- Helper: Check if string is URL ---
  const isValidUrl = (url) => url && typeof url === 'string' && (url.match(/^https?:\/\//) || url.startsWith('/'));

  // --- Helper: Get Button Text ---
  const getFileStatusText = (field, isMultiple = false) => {
      if(isMultiple) {
          return formFiles[field].length > 0 ? `${formFiles[field].length} New File(s)` : 'Upload Gallery';
      }
      return formFiles[field] ? 'Change File' : 'Upload File';
  };

  // --- MAIN SUBMIT HANDLER ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if(!shopData?._id) return showPopupMessage("Error: Shop ID missing", "error");

    setIsSubmitting(true);

    const data = new FormData();
    
    // 1. Append all text fields
    Object.keys(editFormData).forEach(key => {
        data.append(key, editFormData[key]);
    });
    
    // 2. Append Files
    if (formFiles.businessImages.length > 0) {
        formFiles.businessImages.forEach(file => { 
            data.append('businessImages', file); 
        });
    }

    if (formFiles.nationalIdImage) { 
        data.append('nationalIdImage', formFiles.nationalIdImage); 
    }
    if (formFiles.ownerImage) { 
        data.append('ownerImage', formFiles.ownerImage); 
    }
    
    try {
        // API CALL
        const response = await updateBusinessDetailsAPI(shopData._id, data); 
        
        if (response.success || response) {
            // SUCCESS POPUP TRIGGER
            showPopupMessage("Updated Successfully!", "success");
        }
    } catch (error) {
        console.error("Update Error:", error);
        showPopupMessage(error.message || "Failed to update business details", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form id="editShopForm" onSubmit={handleUpdateSubmit} className="space-y-8 relative min-h-[400px]">
        
        {/* --- POPUP MESSAGE OVERLAY (CENTERED) --- */}
        {feedback.show && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-white/30 rounded-3xl transition-all duration-300">
                <div className={`
                    flex flex-col items-center gap-3 px-8 py-6 rounded-2xl shadow-2xl transform scale-110 animate-in zoom-in duration-200 border
                    ${feedback.type === 'success' 
                        ? 'bg-emerald-600 border-emerald-500 text-white' 
                        : 'bg-rose-600 border-rose-500 text-white'}
                `}>
                    {feedback.type === 'success' ? (
                        <div className="bg-white rounded-full p-2">
                            <CheckCircle size={40} className="text-emerald-600" strokeWidth={3} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-full p-2">
                            <AlertCircle size={40} className="text-rose-600" strokeWidth={3} />
                        </div>
                    )}
                    
                    <div className="text-center">
                        <h4 className="text-xl font-black uppercase tracking-wide">
                            {feedback.type === 'success' ? 'Success' : 'Error'}
                        </h4>
                        <p className="text-sm font-bold opacity-90 mt-1">{feedback.message}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Loading Overlay (When submitting but before success/error) */}
        {isSubmitting && !feedback.show && (
            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[2px] rounded-xl">
                <div className="flex flex-col items-center bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-100">
                    <Loader2 className="animate-spin text-amber-600 mb-2" size={32} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Updating...</span>
                </div>
            </div>
        )}

        {/* --- FORM CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* User & Owner Details */}
            <div className="col-span-2 space-y-4">
                 <div className="flex items-center gap-2 text-amber-600">
                    <User size={16} strokeWidth={3}/>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Ownership Details</h4>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Select User (By Name)</label>
                        <select 
                            name="userId" value={editFormData.userId} onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 outline-none transition-all"
                        >
                            <option value="">-- Choose User Name --</option>
                            {users.map(u => (
                              <option key={u._id} value={u._id}>{u.fullName || u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Legal Owner Name</label>
                        <input 
                            type="text" 
                            name="ownerName" 
                            value={editFormData.ownerName} 
                            onChange={handleInputChange} 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 outline-none transition-all" 
                        />
                    </div>
                 </div>
            </div>

            {/* Business Info */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-amber-600">
                    <Info size={16} strokeWidth={3}/>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Business Information</h4>
                 </div>
                 <div className="space-y-3">
                    <input type="text" name="businessName" placeholder="Business Name" required value={editFormData.businessName} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all" />
                    <select 
                        required name="category" value={editFormData.category} onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 outline-none transition-all"
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <textarea name="details" placeholder="Brief business details..." rows="3" required value={editFormData.details} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all resize-none"></textarea>
                 </div>
            </div>

            {/* Contact & Address */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-amber-600">
                    <Phone size={16} strokeWidth={3}/>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Contact & Address</h4>
                 </div>
                 <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input type="tel" name="mobileNumber" placeholder="Mobile Number" required value={editFormData.mobileNumber} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all" />
                        <input type="tel" name="whatsappNumber" placeholder="WhatsApp Number" required value={editFormData.whatsappNumber} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all" />
                    </div>
                    <input type="text" name="location" placeholder="Area / City" required value={editFormData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all" />
                    <input type="text" name="address" placeholder="Full Detailed Address" required value={editFormData.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all" />
                 </div>
            </div>
            
            {/* File Uploads */}
            <div className="col-span-2 space-y-6 pt-4 border-t border-slate-200">
                 <div className="flex items-center gap-2 text-amber-600">
                    <Upload size={16} strokeWidth={3}/>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Update Documents</h4>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* National ID */}
                    <div className="space-y-2 border border-slate-100 p-3 rounded-2xl shadow-sm bg-white">
                        <p className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-2">NATIONAL ID PROOF</p>
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50">
                            {(previews.nationalIdImage || isValidUrl(shopData.nationalIdImage)) ? (
                                <img 
                                    src={previews.nationalIdImage || shopData.nationalIdImage} 
                                    className="w-full h-full object-cover" 
                                    style={{ opacity: previews.nationalIdImage ? 1 : 0.6 }} // Dim if old image
                                    alt="National ID"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className='text-xs text-slate-400 font-bold'>No Image</p>
                                </div>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center group">
                                <label className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 rounded-full cursor-pointer hover:bg-amber-600 transition-all shadow-md">
                                    <Pencil size={12} className='text-white'/>
                                    <span className="text-[10px] font-bold text-white">{getFileStatusText('nationalIdImage')}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'nationalIdImage')} />
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Owner Photo */}
                    <div className="space-y-2 border border-slate-100 p-3 rounded-2xl shadow-sm bg-white">
                        <p className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-2">OWNER PHOTO</p>
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50">
                            {(previews.ownerImage || isValidUrl(shopData.ownerImage)) ? (
                                <img 
                                    src={previews.ownerImage || shopData.ownerImage} 
                                    className="w-full h-full object-cover" 
                                    style={{ opacity: previews.ownerImage ? 1 : 0.6 }}
                                    alt="Owner Photo"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className='text-xs text-slate-400 font-bold'>No Photo</p>
                                </div>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center group">
                                <label className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 rounded-full cursor-pointer hover:bg-amber-600 transition-all shadow-md">
                                    <Pencil size={12} className='text-white'/>
                                    <span className="text-[10px] font-bold text-white">{getFileStatusText('ownerImage')}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'ownerImage')} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Shop Images (Multiple) */}
                    <div className="space-y-2 border border-slate-100 p-3 rounded-2xl shadow-sm bg-white">
                        <p className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-2">SHOP IMAGES</p>
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50 flex flex-col items-center justify-center">
                             {(previews.businessImages.length > 0 || (shopData.businessImages && shopData.businessImages.length > 0)) ? (
                                <img 
                                    src={previews.businessImages.length > 0 ? previews.businessImages[0] : shopData.businessImages[0]} 
                                    className="w-full h-full object-cover" 
                                    style={{ opacity: previews.businessImages.length > 0 ? 1 : 0.6 }}
                                    alt="Shop Image"
                                />
                             ) : (
                                <ImageIcon size={24} className='text-slate-300 mb-1'/>
                             )}
                             
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                <label className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 rounded-full cursor-pointer hover:bg-amber-600 transition-all shadow-md">
                                    <Pencil size={12} className='text-white'/>
                                    <span className="text-[10px] font-bold text-white">{getFileStatusText('businessImages', true)}</span>
                                    <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'businessImages')} />
                                </label>
                             </div>
                        </div>
                        {/* Selected Files Indicator */}
                        {formFiles.businessImages.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle size={10}/> {formFiles.businessImages.length} New Images
                                </span>
                            </div>
                        ) : (
                             // Show Existing Count
                             shopData.businessImages?.length > 0 && (
                                <div className="mt-2 text-[10px] font-bold text-slate-400 text-center">
                                    Current Gallery: {shopData.businessImages.length} images
                                </div>
                             )
                        )}
                    </div>
                 </div>
            </div>
        </div>
    </form>
  );
};

export default ShopEditForm;