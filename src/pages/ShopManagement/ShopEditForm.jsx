import React, { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, X, User, Info, Phone, AlertCircle, Upload, Pencil, ImageIcon } from 'lucide-react';


// *** IMPORTANT ***: मैंने आपके संदर्भ से यह API इम्पोर्ट कर ली है। 
// आपको यह सुनिश्चित करना होगा कि यह API सही ढंग से इम्पोर्ट हो और `apiClient` के माध्यम से काम करे।
// इस कोड को चलाने के लिए आपको इसे `../../auth/adminLogin` से सही ढंग से इम्पोर्ट करना होगा।
// इस उदाहरण के लिए, मैं इसे यहाँ डमी के रूप में रख रहा हूँ, लेकिन आपको अपने मुख्य फ़ाइल से इसे हटाकर सही इम्पोर्ट का उपयोग करना होगा।
const updateBusinessDetailsAPI = async (id, data) => {
    console.log(`API Call: updateBusinessDetailsAPI for ID: ${id}`);
    // डमी सफल प्रतिक्रिया (असली लॉजिक के लिए इसे हटा दें और सही API से बदलें)
    return { success: true }; 
};
// ********************************************************************


const ShopEditForm = ({ shopData, users, categories, onClose }) => {

  const [editFormData, setEditFormData] = useState({
    // सुनिश्चित करें कि userId सही ढंग से सेट हो, भले ही वह ऑब्जेक्ट हो या ID स्ट्रिंग
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
    businessImages: [], // Array of new files
    nationalIdImage: null, // Single new file
    ownerImage: null, // Single new file
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: "", type: "success" });

  const showLocalFeedback = (message, type = "success") => {
    setFeedback({ show: true, message, type });
    if (type === 'success') {
        setTimeout(() => setFeedback({ show: false, message: "", type: "success" }), 3000);
    }
  };

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

  const handleFileChange = (e, field) => {
    if (field === "businessImages") {
      // पुरानी फाइलों को नए से बदलें (या यदि आप जोड़ना चाहते हैं तो मौजूदा फाइलों के साथ concat करें)
      setFormFiles(prev => ({ ...prev, [field]: Array.from(e.target.files) }));
    } else {
      setFormFiles(prev => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    
    // सभी फ़ॉर्म डेटा संलग्न करें
    Object.keys(editFormData).forEach(key => data.append(key, editFormData[key]));
    
    // केवल नई फ़ाइलें संलग्न करें
    let filesUploaded = false;
    formFiles.businessImages.forEach(file => { data.append('businessImages', file); filesUploaded = true; });
    if (formFiles.nationalIdImage) { data.append('nationalIdImage', formFiles.nationalIdImage); filesUploaded = true; }
    if (formFiles.ownerImage) { data.append('ownerImage', formFiles.ownerImage); filesUploaded = true; }
    
    // यदि कोई नई फ़ाइल अपलोड नहीं की गई है, तो हम एक विशेष फ्लैग भेज सकते हैं, 
    // लेकिन सबसे सुरक्षित तरीका है कि बैकएंड पर फ़ील्ड को छोड़ दिया जाए यदि वह null/undefined है, 
    // जिससे बैकएंड मौजूदा फ़ाइल को बनाए रखेगा।
    
    try {
        // *** आपको यहाँ `updateBusinessDetailsAPI` को कॉल करना होगा ***
        const response = await updateBusinessDetailsAPI(shopData._id, data); 
        
        if (response.success) {
            showLocalFeedback("Business Details Updated Successfully!");
            // पैरेंट कंपोनेंट को बताएं कि डेटा अपडेट हो गया है और फिर बंद करें
            setTimeout(onClose, 1500);
        }
    } catch (error) {
        // सुनिश्चित करें कि error ऑब्जेक्ट में message प्रॉपर्टी हो
        showLocalFeedback(error.message || "Failed to update business details", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const getFileStatusText = (field, isMultiple = false) => {
      if(isMultiple) {
          return formFiles[field].length > 0 ? `${formFiles[field].length} New File(s) Selected` : 'Upload Gallery';
      }
      return formFiles[field] ? 'New File Selected' : 'Upload File';
  };

  // Helper function to check if the URL is valid before displaying
  const isValidUrl = (url) => url && typeof url === 'string' && (url.match(/^https?:\/\//));


  return (
    <form id="editShopForm" onSubmit={handleUpdateSubmit} className="space-y-8">
        {/* Feedback Popup (Local to this form) */}
        {feedback.show && (
            <div className="p-3 rounded-xl shadow-lg flex items-center gap-3 mb-4" style={{
                backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: feedback.type === 'success' ? '#065f46' : '#991b1b',
                border: feedback.type === 'success' ? '1px solid #059669' : '1px solid #fca5a5'
            }}>
                {feedback.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                <p className="font-bold text-sm tracking-wide">{feedback.message}</p>
                <button onClick={() => setFeedback({ ...feedback, show: false })} className="ml-auto opacity-70 hover:opacity-100 transition-opacity"><X size={16}/></button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Ownership Details */}
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

            {/* Business Information */}
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
            
            {/* --- FILE PREVIEW & UPLOAD SECTION (Matches your image) --- */}
            <div className="col-span-2 space-y-6 pt-4 border-t border-slate-200">
                 <div className="flex items-center gap-2 text-amber-600">
                    <Upload size={16} strokeWidth={3}/>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Update Documents (Current & New)</h4>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* National ID Preview & Upload (Customized to look like your image) */}
                    <div className="space-y-2 border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-2">NATIONAL ID PROOF</p>
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50">
                            {/* 1. Current Image */}
                            {isValidUrl(shopData.nationalIdImage) ? (
                                <img src={shopData.nationalIdImage} className="w-full h-full object-cover opacity-40" alt="Existing ID"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className='text-xs text-slate-400 font-bold'>No Existing Image</p>
                                </div>
                            )}
                            {/* 2. Overlay/Status */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                {isValidUrl(shopData.nationalIdImage) ? (
                                    <>
                                        <p className='text-[10px] font-bold text-blue-600 mb-1'>Existing: Image Available</p>
                                        <label className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 rounded-full cursor-pointer hover:bg-amber-600 transition-all">
                                            <Pencil size={12} className='text-white'/>
                                            <span className="text-[10px] font-bold text-white">{getFileStatusText('nationalIdImage')}</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'nationalIdImage')} />
                                        </label>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center gap-1 px-3 py-1 bg-indigo-500/90 rounded-full cursor-pointer hover:bg-indigo-600 transition-all">
                                        <Upload size={12} className='text-white'/>
                                        <span className="text-[10px] font-bold text-white">{getFileStatusText('nationalIdImage')}</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'nationalIdImage')} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Owner Photo Preview & Upload */}
                    <div className="space-y-2 border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-2">OWNER PHOTO</p>
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50">
                             {/* 1. Current Image */}
                            {isValidUrl(shopData.ownerImage) ? (
                                <img src={shopData.ownerImage} className="w-full h-full object-cover opacity-40" alt="Existing Owner Photo"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className='text-xs text-slate-400 font-bold'>No Existing Photo</p>
                                </div>
                            )}
                             {/* 2. Overlay/Status */}
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                {isValidUrl(shopData.ownerImage) ? (
                                    <>
                                        <p className='text-[10px] font-bold text-blue-600 mb-1'>Existing: Image Available</p>
                                        <label className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 rounded-full cursor-pointer hover:bg-amber-600 transition-all">
                                            <Pencil size={12} className='text-white'/>
                                            <span className="text-[10px] font-bold text-white">{getFileStatusText('ownerImage')}</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'ownerImage')} />
                                        </label>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center gap-1 px-3 py-1 bg-indigo-500/90 rounded-full cursor-pointer hover:bg-indigo-600 transition-all">
                                        <Upload size={12} className='text-white'/>
                                        <span className="text-[10px] font-bold text-white">{getFileStatusText('ownerImage')}</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'ownerImage')} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shop Images Preview & Upload (Matches your image) */}
                    <div className="space-y-2 border border-slate-100 p-3 rounded-2xl shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-2">SHOP IMAGES</p>
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50 flex flex-col items-center justify-center">
                             {/* 1. Display Existing Image (if any) */}
                             {isValidUrl(shopData.businessImages?.[0]) ? (
                                <img 
                                    src={shopData.businessImages[0]} 
                                    className="w-full h-full object-cover opacity-40" 
                                    alt="Existing Shop Image"
                                />
                             ) : (
                                <ImageIcon size={24} className='text-slate-300 mb-1'/>
                             )}
                             
                             {/* 2. Overlay for Status and Upload Button */}
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-white/80">
                                {isValidUrl(shopData.businessImages?.[0]) ? (
                                    <>
                                        <p className='text-[10px] font-bold text-slate-700 mb-1'>Existing Image Found</p>
                                        <label className="flex items-center gap-1 px-3 py-1 bg-amber-500/90 rounded-full cursor-pointer hover:bg-amber-600 transition-all">
                                            <Pencil size={12} className='text-white'/>
                                            <span className="text-[10px] font-bold text-white">{getFileStatusText('businessImages', true)}</span>
                                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'businessImages')} />
                                        </label>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center gap-1 px-3 py-1 bg-indigo-500/90 rounded-full cursor-pointer hover:bg-indigo-600 transition-all">
                                        <Upload size={12} className='text-white'/>
                                        <span className="text-[10px] font-bold text-white">{getFileStatusText('businessImages', true)}</span>
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'businessImages')} />
                                    </label>
                                )}
                             </div>
                        </div>
                        {formFiles.businessImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formFiles.businessImages.map((file, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold">
                                        {file.name.substring(0, 15)}...
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
            </div>
            {/* --- FILE PREVIEW & UPLOAD SECTION समाप्त --- */}
        </div>
    </form>
  );
};

export default ShopEditForm;