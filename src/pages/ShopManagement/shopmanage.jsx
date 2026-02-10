
import React, { useState, useEffect, useCallback } from "react"; 
import { 
  Search, Eye, Edit3, ShieldOff, Trash2, 
  Calendar, ArrowUpCircle, MapPin, Phone, X,
  AlertCircle, Clock, Save, Loader2, UploadCloud
} from "lucide-react";

import { 
    getAllShopsForAdmin,
    getShopDetailsById,
    deletebusiness,
    toggleBusinessStatusAPI,
    getAllUsersAPI,
    getAllCategories // <-- API for Category Dropdown
} from "../../auth/adminLogin"; 

// REMOVED: Mock createNewBusiness function

const ModalField = ({ label, value, fullWidth = false }) => (
    <div className={`${fullWidth ? "col-span-2" : "col-span-1"}`}>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            {label}
        </label>
        <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
            {value || "N/A"}
        </div>
    </div>
);

const FormInput = ({ label, name, value, onChange, type = "text", fullWidth = false, isReadOnly = false, required = false }) => (
    <div className={`${fullWidth ? "col-span-2" : "col-span-1"}`}>
        <label htmlFor={name} className="block text-xs font-bold text-slate-500 uppercase mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={3}
                readOnly={isReadOnly}
                required={required}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
            />
        ) : (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                readOnly={isReadOnly}
                required={required}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
            />
        )}
    </div>
);

const UserSelect = ({ users, selectedUserId, onChange, userLoading }) => (
    <div className="col-span-2">
        <label htmlFor="userSelect" className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Select Shop Owner <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            <select
                id="userSelect"
                value={selectedUserId}
                onChange={onChange}
                disabled={userLoading || users.length === 0}
                required
                className="w-full p-2.5 appearance-none bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
            >
                <option value="" disabled>{userLoading ? 'Loading Users...' : users.length === 0 ? 'No Users Available' : 'Select a User'}</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.fullName}
                    </option>
                ))}
            </select>
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    </div>
);

// --- NEW CategorySelect Component ---
const CategorySelect = ({ categories, selectedCategoryId, onChange, categoryLoading }) => (
    <div className="col-span-2">
        <label htmlFor="categorySelect" className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Select Shop Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            <select
                id="categorySelect"
                value={selectedCategoryId}
                onChange={onChange}
                disabled={categoryLoading || categories.length === 0}
                required
                className="w-full p-2.5 appearance-none bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
            >
                <option value="" disabled>{categoryLoading ? 'Loading Categories...' : categories.length === 0 ? 'No Categories Available' : 'Select a Category'}</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    </div>
);
// -------------------------------------


const FileUploader = ({ label, name, selectedFile, onChange }) => (
    <div className="col-span-1">
        <label htmlFor={name} className="block text-xs font-bold text-slate-500 uppercase mb-1">
            {label}
        </label>
        <div className="flex flex-col gap-1">
            <input
                id={name}
                name={name}
                type="file"
                onChange={onChange}
                className="hidden"
                accept="image/*,.pdf"
            />
            <label 
                htmlFor={name}
                className="cursor-pointer w-full p-2.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
                <UploadCloud size={16} className="mr-2"/>
                {selectedFile ? 'Change File' : 'Choose File'}
            </label>
            <div className="text-xs font-medium text-slate-500 truncate text-center">
                {selectedFile ? selectedFile.name : <span className="text-amber-500">File not selected</span>}
            </div>
        </div>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <span className="text-slate-400 text-sm">Loading Shops...</span>
    </div>
);

const ErrorState = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-red-200 p-4">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <span className="text-red-700 text-center font-semibold">Error: {message}</span>
        <button 
            onClick={onRetry} 
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
            Try Again
        </button>
    </div>
);

const EmptyState = ({ filter }) => (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200 p-4">
        <Search className="mx-auto mb-2 text-slate-300" size={24}/>
        <p className="font-bold text-slate-600">No Shops Found</p>
        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or check the data source.</p>
    </div>
);

const PlanBadge = ({ plan }) => {
  const styles = {
    "Pro+": "bg-purple-100 text-purple-700 border-purple-200",
    "Lite": "bg-blue-100 text-blue-700 border-blue-200",
    "Trial": "bg-slate-100 text-slate-700 border-slate-200"
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase ${styles[plan] || styles['Trial']}`}>
      {plan}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Expired: "bg-amber-50 text-amber-600 border-amber-100",
    Blocked: "bg-red-50 text-red-600 border-red-100"
  };
  const badgeStatus = status === 'Approved' ? 'Active' : status; 
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${styles[badgeStatus] || styles['Blocked']}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${badgeStatus === 'Active' ? 'bg-emerald-500' : badgeStatus === 'Expired' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
      {status} 
    </span>
  );
};

const ActionButton = ({ icon, color, title, onClick }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
    red: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    slate: "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100",
    green: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
  };
  return (
    <button 
      onClick={onClick}
      title={title} 
      className={`p-1.5 rounded-lg border transition-all active:scale-95 ${colors[color]}`}
    >
      {icon}
    </button>
  );
};


const ShopListManagement = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const [shops, setShops] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(''); 
  
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopDetailLoading, setShopDetailLoading] = useState(false); 
  
  const initialFormData = {
    userId: '', businessName: '', details: '', category: '', location: '', address: '', ownerName: '', mobileNumber: '', whatsappNumber: '',
    businessImages: null, nationalIdImage: null, ownerImage: null,
  };
  const [formData, setFormData] = useState(initialFormData); 


  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dataResult = await getAllShopsForAdmin(); 
      const shopArray = Array.isArray(dataResult) ? dataResult : (dataResult.data || []); 
      setShops(shopArray); 
    } catch (err) {
      setError(err.message || "Failed to load shop data.");
      setShops([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  // --- NEW: Fetch Categories ---
  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true);
    try {
        const result = await getAllCategories(); 
        const categoryArray = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
        setCategories(categoryArray); 
    } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
    } finally {
        setCategoryLoading(false);
    }
  }, []);
  // -----------------------------

  useEffect(() => {
    fetchShops();
    fetchCategories(); // Call to fetch categories on mount
  }, [fetchShops, fetchCategories]);
  
  const fetchUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      const result = await getAllUsersAPI(); 
      const validUsers = Array.isArray(result.data) ? result.data.filter(u => u.fullName && u._id) : [];
      setUsers(validUsers); 
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setUserLoading(false);
    }
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] || null }));
  };

  // --- RESTORED: Handle User Selection ---
  const handleUserSelectChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = users.find(u => u._id === userId);
    
    if (user) {
        setFormData(prev => ({
            ...prev,
            userId: user._id,
            ownerName: user.fullName || '',
            mobileNumber: user.mobile || '', 
            whatsappNumber: user.mobile || '', 
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            userId: '',
            ownerName: '',
            mobileNumber: '',
            whatsappNumber: '',
        }));
    }
  };
  // --------------------------------------

  // --- NEW: Handle Category Selection ---
  const handleCategorySelectChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    const category = categories.find(c => c._id === categoryId);
    
    if (category) {
        setFormData(prev => ({
            ...prev,
            category: category.name, // Storing name to match shop display
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            category: '',
        }));
    }
  };
  // --------------------------------------


  const handleAction = async (type, shop = null) => {
    setModalType(type);
    setIsModalOpen(true);
    
    if (type === 'create') {
        setSelectedUserId(''); // Reset user selection
        setSelectedCategoryId(''); // Reset category selection
        setFormData(initialFormData); 
        setSelectedShop(null); 
        fetchUsers(); 
        fetchCategories(); // Ensure categories are loaded
        return;
    }

    if (type === 'view') {
        setShopDetailLoading(true);
        try {
            const detailedData = await getShopDetailsById(shop._id);
            setSelectedShop(detailedData);
        } catch (err) {
            alert("Failed to fetch shop details.");
            setSelectedShop(shop);
        } finally {
            setShopDetailLoading(false);
        }
    } else {
        setSelectedShop(shop);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShop(null);
    setFormData(initialFormData);
    setSelectedUserId('');
    setSelectedCategoryId('');
  };
  
  const handleSave = async () => {
      if (!selectedShop || !modalType) return;
      try {
          setShops(prevShops => prevShops.map(shop => 
            shop._id === selectedShop._id ? { ...shop, ...formData } : shop
          ));
          alert(`Action ${modalType} completed successfully (Simulated)!`);
          closeModal();
      } catch (err) {
          alert(`Action failed: ${JSON.stringify(err.message || err)}`);
      }
  };

  const handleCreateShop = async () => {
    // MANDATORY FIELD CHECK: Now checking userId (via UserSelect), Category (via CategorySelect), and others
    if (!formData.userId || !formData.businessName || !formData.ownerName || !formData.mobileNumber || !formData.category || !formData.location) {
        alert("Please fill all mandatory fields (User Selection, Category Selection, Business Name, Owner Name, Mobile, Location).");
        return;
    }
    
    try {
        // Re-using the mock function for structure consistency with the provided file content
        const result = await createNewBusiness(formData); 

        if (result.success) {
            setShops(prevShops => [result.newShop, ...prevShops]);
            alert(result.message);
            closeModal();
        } else {
            throw new Error(result.message || "Shop creation failed.");
        }
    } catch (err) {
        alert(`Creation failed: ${JSON.stringify(err.message || err)}`);
    }
  };
  
  const handleDelete = async () => {
      if (!selectedShop) return;
      const shopIdToDelete = selectedShop._id; 
      const shopName = selectedShop.businessName;

      try {
          await deletebusiness(shopIdToDelete); 
          setShops(prevShops => prevShops.filter(shop => shop._id !== shopIdToDelete)); 
          alert(`Shop '${shopName}' deleted successfully!`); 
          closeModal();
      } catch (err) {
          const errorMessage = err.message || (err.data && err.data.message) || "An unknown error occurred during deletion.";
          alert(`Deletion failed: ${errorMessage}`); 
      }
  };

  const handleToggleStatus = async () => { 
    if (!selectedShop) return;
    const shopId = selectedShop._id;
    const currentStatus = selectedShop.status;
    
    const newStatus = currentStatus === 'Blocked' ? 'Approved' : 'Blocked'; 
    const actionText = newStatus === 'Blocked' ? 'Block' : 'Unblock';

    try {
        await toggleBusinessStatusAPI(shopId, newStatus); 
        
        setShops(prevShops => prevShops.map(shop => 
            shop._id === shopId ? { ...shop, status: newStatus } : shop
        ));

        alert(`Shop '${selectedShop.businessName}' successfully set to ${newStatus}.`);
        closeModal();
    } catch (err) {
        const errorMessage = err.message || (err.data && err.data.message) || `An unknown error occurred during ${actionText}.`;
        alert(`${actionText} failed: ${errorMessage}`);
    }
  };


  const filteredShops = Array.isArray(shops)
    ? shops.filter(shop => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Expired") return shop.status === "Expired";
        if (activeFilter === "Blocked") return shop.status === "Blocked";
        return shop.plan === activeFilter; 
      })
    : []; 

  const renderContent = () => {
      if (loading) return <LoadingState />;
      if (error) return <ErrorState message={error} onRetry={fetchShops} />;
      if (filteredShops.length === 0) return <EmptyState filter={activeFilter} />;
      
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">#</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shop Details</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Owner Info</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan Details</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredShops.map((shop, index) => ( 
                <tr key={shop._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{shop.businessName}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {shop.location || 'N/A'} • {shop.category || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{shop.ownerName || 'N/A'}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Phone size={10} /> {shop.mobileNumber || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <PlanBadge plan={shop.plan || 'Trial'} />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                        <Calendar size={12} /> {shop.expiry || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={shop.status || 'Blocked'} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1.5">
                      <ActionButton icon={<Eye size={14}/>} color="blue" title="View Profile" onClick={() => handleAction('view', shop)} />
                      <ActionButton icon={<Edit3 size={14}/>} color="amber" title="Edit Shop" onClick={() => handleAction('edit', shop)} />
                      <ActionButton icon={<Clock size={14}/>} color="indigo" title="Extend Plan" onClick={() => handleAction('extend', shop)} />
                      <ActionButton icon={<ArrowUpCircle size={14}/>} color="emerald" title="Upgrade" onClick={() => handleAction('upgrade', shop)} />
                      <ActionButton 
                        icon={<ShieldOff size={14}/>} 
                        color={shop.status === 'Blocked' ? 'slate' : 'green'} 
                        title={shop.status === 'Blocked' ? 'Unblock' : 'Block'} 
                        onClick={() => handleAction('block', shop)} 
                      />
                      <ActionButton icon={<Trash2 size={14}/>} color="red" title="Delete" onClick={() => handleAction('delete', shop)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Shop Management</h1>
          <p className="text-slate-500 text-sm">Monitor plans, expiry, and shop status</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleAction('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            + Create New Shop
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Trial", "Lite", "Pro+", "Expired", "Blocked"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeFilter === filter
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Shop ID, Name or Owner..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
        {renderContent()}
      </div>

      {isModalOpen && (selectedShop || modalType === 'create') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {modalType === 'create' ? 'Create New Shop' :
                 modalType === 'view' ? 'Shop Details' : 
                 modalType === 'edit' ? 'Edit Shop' : 
                 modalType === 'block' ? (selectedShop.status === 'Blocked' ? 'Unblock Confirmation' : 'Block Confirmation') :
                 'Manage Shop'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              
              {modalType === 'view' && shopDetailLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                      <p className="text-slate-500 font-medium">Fetching Business Details...</p>
                  </div>
              ) : (
                  <>
                      {(modalType === 'view' || modalType === 'edit') && selectedShop && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ModalField label="User ID" value={selectedShop.userId} />
                              <ModalField label="Business Name" value={selectedShop.businessName} />
                              <ModalField label="Owner Name" value={selectedShop.ownerName} />
                              <ModalField label="Mobile Number" value={selectedShop.mobileNumber} />
                              <ModalField label="Category" value={selectedShop.category} />
                              <ModalField label="City / Location" value={selectedShop.location} />
                              <ModalField label="Address" value={selectedShop.address} fullWidth />
                              <ModalField label="Plan Type" value={selectedShop.plan} />
                              <ModalField label="Status" value={selectedShop.status} />
                              <ModalField label="Description / Details" value={selectedShop.details} fullWidth />
                          </div>
                      )}

                      {modalType === 'create' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* --- MODIFIED: Keeping UserSelect and adding CategorySelect --- */}
                              <UserSelect 
                                users={users} 
                                selectedUserId={selectedUserId} 
                                onChange={handleUserSelectChange} 
                                userLoading={userLoading}
                              />
                              <CategorySelect 
                                categories={categories} 
                                selectedCategoryId={selectedCategoryId} 
                                onChange={handleCategorySelectChange} 
                                categoryLoading={categoryLoading}
                              />
                              {/* Removed FormInput for userId as it's set from UserSelect, and the form input was removed in the previous step */}
                              
                              <FormInput label="Business Name" name="businessName" value={formData.businessName} onChange={handleInputChange} required />
                              {/* Category is now handled by CategorySelect, it populates formData.category */}
                              
                              <FormInput label="Location (City)" name="location" value={formData.location} onChange={handleInputChange} required />
                              <FormInput label="Address (Shop/Street)" name="address" value={formData.address} onChange={handleInputChange} fullWidth required />

                              <FormInput label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
                              <FormInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} type="tel" required />
                              <FormInput label="WhatsApp Number (Optional)" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} type="tel" />
                              
                              <FormInput label="Details / Description" name="details" value={formData.details} onChange={handleInputChange} type="textarea" fullWidth />

                              <FileUploader label="Business Images" name="businessImages" selectedFile={formData.businessImages} onChange={handleFileChange} />
                              <FileUploader label="National ID Image" name="nationalIdImage" selectedFile={formData.nationalIdImage} onChange={handleFileChange} />
                              <FileUploader label="Owner Image" name="ownerImage" selectedFile={formData.ownerImage} onChange={handleFileChange} />

                          </div>
                      )}

                      {modalType === 'delete' && selectedShop && (
                          <div className="text-center py-4">
                              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-slate-800">Delete Shop?</h3>
                              <p className="text-slate-500 mt-2">Are you sure you want to delete <b>{selectedShop.businessName}</b>?</p>
                          </div>
                      )}

                      {modalType === 'block' && selectedShop && (
                          <div className="text-center py-4">
                              <ShieldOff size={48} className={`mx-auto mb-4 ${selectedShop.status === 'Blocked' ? 'text-emerald-500' : 'text-slate-500'}`} />
                              <h3 className="text-xl font-bold text-slate-800">
                                  {selectedShop.status === 'Blocked' ? 'Unblock Shop?' : 'Block Shop?'}
                              </h3>
                              <p className="text-slate-500 mt-2">
                                  Are you sure you want to {selectedShop.status === 'Blocked' ? 'unblock' : 'block'} 
                                  <b> {selectedShop.businessName}</b>? 
                                  {selectedShop.status !== 'Blocked' && (
                                    <span className="block text-red-500 font-semibold text-sm mt-1">
                                      This will restrict user access immediately.
                                    </span>
                                  )}
                              </p>
                          </div>
                      )}
                  </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
               <button 
                  onClick={closeModal} 
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
               >
                 Cancel
               </button>
               
               {modalType === 'create' ? (
                   <button onClick={handleCreateShop} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700">
                     <Save size={16} className="mr-1 inline-block"/> Save New Shop
                   </button>
               ) : modalType === 'view' ? (
                   <button 
                     onClick={closeModal}
                     className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors"
                   >
                     Close View
                   </button>
               ) : modalType === 'delete' ? (
                   <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700">
                     Confirm Delete
                   </button>
               ) : modalType === 'block' ? ( 
                   <button 
                     onClick={handleToggleStatus} 
                     className={`px-6 py-2 text-white text-sm font-bold rounded-md transition-colors ${selectedShop.status === 'Blocked' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-600 hover:bg-slate-700'}`}
                   >
                     {selectedShop.status === 'Blocked' ? 'Confirm Unblock' : 'Confirm Block'}
                   </button>
               ) : (
                   <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">
                     Save Changes
                   </button>
               )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ShopListManagement;


// import React, { useState, useEffect, useCallback } from "react"; 
// import { 
//   Search, Eye, Edit3, ShieldOff, Trash2, 
//   Calendar, ArrowUpCircle, MapPin, Phone, X,
//   AlertCircle, Clock, Save, Loader2, UploadCloud
// } from "lucide-react";

// import { 
//     getAllShopsForAdmin,
//     getShopDetailsById,
//     deletebusiness,
//     toggleBusinessStatusAPI,
//     getAllUsersAPI,
//     getAllCategories // <-- API for Category Dropdown
// } from "../../auth/adminLogin"; 

// // REMOVED: Mock createNewBusiness function

// const ModalField = ({ label, value, fullWidth = false }) => (
//     <div className={`${fullWidth ? "col-span-2" : "col-span-1"}`}>
//         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
//             {label}
//         </label>
//         <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
//             {value || "N/A"}
//         </div>
//     </div>
// );

// const FormInput = ({ label, name, value, onChange, type = "text", fullWidth = false, isReadOnly = false, required = false }) => (
//     <div className={`${fullWidth ? "col-span-2" : "col-span-1"}`}>
//         <label htmlFor={name} className="block text-xs font-bold text-slate-500 uppercase mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         {type === 'textarea' ? (
//             <textarea
//                 id={name}
//                 name={name}
//                 value={value}
//                 onChange={onChange}
//                 rows={3}
//                 readOnly={isReadOnly}
//                 required={required}
//                 className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
//             />
//         ) : (
//             <input
//                 id={name}
//                 name={name}
//                 type={type}
//                 value={value}
//                 onChange={onChange}
//                 readOnly={isReadOnly}
//                 required={required}
//                 className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
//             />
//         )}
//     </div>
// );

// const UserSelect = ({ users, selectedUserId, onChange, userLoading }) => (
//     <div className="col-span-2">
//         <label htmlFor="userSelect" className="block text-xs font-bold text-slate-500 uppercase mb-1">
//             Select Shop Owner <span className="text-red-500">*</span>
//         </label>
//         <div className="relative">
//             <select
//                 id="userSelect"
//                 value={selectedUserId}
//                 onChange={onChange}
//                 disabled={userLoading || users.length === 0}
//                 required
//                 className="w-full p-2.5 appearance-none bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
//             >
//                 <option value="" disabled>{userLoading ? 'Loading Users...' : users.length === 0 ? 'No Users Available' : 'Select a User'}</option>
//                 {users.map(user => (
//                     <option key={user._id} value={user._id}>
//                         {user.fullName}
//                     </option>
//                 ))}
//             </select>
//             <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//         </div>
//     </div>
// );

// // --- NEW CategorySelect Component ---
// const CategorySelect = ({ categories, selectedCategoryId, onChange, categoryLoading }) => (
//     <div className="col-span-2">
//         <label htmlFor="categorySelect" className="block text-xs font-bold text-slate-500 uppercase mb-1">
//             Select Shop Category <span className="text-red-500">*</span>
//         </label>
//         <div className="relative">
//             <select
//                 id="categorySelect"
//                 value={selectedCategoryId}
//                 onChange={onChange}
//                 disabled={categoryLoading || categories.length === 0}
//                 required
//                 className="w-full p-2.5 appearance-none bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-100 transition-colors"
//             >
//                 <option value="" disabled>{categoryLoading ? 'Loading Categories...' : categories.length === 0 ? 'No Categories Available' : 'Select a Category'}</option>
//                 {categories.map(cat => (
//                     <option key={cat._id} value={cat._id}>
//                         {cat.name}
//                     </option>
//                 ))}
//             </select>
//             <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//         </div>
//     </div>
// );
// // -------------------------------------

// const FileUploader = ({ label, name, selectedFile, onChange }) => (
//     <div className="col-span-1">
//         <label htmlFor={name} className="block text-xs font-bold text-slate-500 uppercase mb-1">
//             {label}
//         </label>
//         <div className="flex flex-col gap-1">
//             <input
//                 id={name}
//                 name={name}
//                 type="file"
//                 onChange={onChange}
//                 className="hidden"
//                 accept="image/*,.pdf"
//             />
//             <label 
//                 htmlFor={name}
//                 className="cursor-pointer w-full p-2.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-blue-100 transition-colors"
//             >
//                 <UploadCloud size={16} className="mr-2"/>
//                 {selectedFile ? 'Change File' : 'Choose File'}
//             </label>
//             <div className="text-xs font-medium text-slate-500 truncate text-center">
//                 {selectedFile ? selectedFile.name : <span className="text-amber-500">File not selected</span>}
//             </div>
//         </div>
//     </div>
// );

// const LoadingState = () => (
//     <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
//         <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
//         <span className="text-slate-400 text-sm">Loading Shops...</span>
//     </div>
// );

// const ErrorState = ({ message, onRetry }) => (
//     <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-red-200 p-4">
//         <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
//         <span className="text-red-700 text-center font-semibold">Error: {message}</span>
//         <button 
//             onClick={onRetry} 
//             className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
//         >
//             Try Again
//         </button>
//     </div>
// );

// const EmptyState = ({ filter }) => (
//     <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200 p-4">
//         <Search className="mx-auto mb-2 text-slate-300" size={24}/>
//         <p className="font-bold text-slate-600">No Shops Found</p>
//         <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or check the data source.</p>
//     </div>
// );

// const PlanBadge = ({ plan }) => {
//   const styles = {
//     "Pro+": "bg-purple-100 text-purple-700 border-purple-200",
//     "Lite": "bg-blue-100 text-blue-700 border-blue-200",
//     "Trial": "bg-slate-100 text-slate-700 border-slate-200"
//   };
//   return (
//     <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase ${styles[plan] || styles['Trial']}`}>
//       {plan}
//     </span>
//   );
// };

// const StatusBadge = ({ status }) => {
//   const styles = {
//     Active: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     Expired: "bg-amber-50 text-amber-600 border-amber-100",
//     Blocked: "bg-red-50 text-red-600 border-red-100"
//   };
//   const badgeStatus = status === 'Approved' ? 'Active' : status; 
//   return (
//     <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${styles[badgeStatus] || styles['Blocked']}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${badgeStatus === 'Active' ? 'bg-emerald-500' : badgeStatus === 'Expired' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
//       {status} 
//     </span>
//   );
// };

// const ActionButton = ({ icon, color, title, onClick }) => {
//   const colors = {
//     blue: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
//     amber: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
//     red: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
//     emerald: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
//     indigo: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
//     slate: "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100",
//     green: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
//   };
//   return (
//     <button 
//       onClick={onClick}
//       title={title} 
//       className={`p-1.5 rounded-lg border transition-all active:scale-95 ${colors[color]}`}
//     >
//       {icon}
//     </button>
//   );
// };


// const ShopListManagement = () => {
//   const [activeFilter, setActiveFilter] = useState("All");
  
//   const [shops, setShops] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [users, setUsers] = useState([]);
//   const [userLoading, setUserLoading] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(''); 
  
//   const [categories, setCategories] = useState([]);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(""); 
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [shopDetailLoading, setShopDetailLoading] = useState(false); 
  
//   const initialFormData = {
//     userId: '', businessName: '', details: '', category: '', location: '', address: '', ownerName: '', mobileNumber: '', whatsappNumber: '',
//     businessImages: null, nationalIdImage: null, ownerImage: null,
//   };
//   const [formData, setFormData] = useState(initialFormData); 


//   const fetchShops = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const dataResult = await getAllShopsForAdmin(); 
//       const shopArray = Array.isArray(dataResult) ? dataResult : (dataResult.data || []); 
//       setShops(shopArray); 
//     } catch (err) {
//       setError(err.message || "Failed to load shop data.");
//       setShops([]); 
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // --- NEW: Fetch Categories ---
//   const fetchCategories = useCallback(async () => {
//     setCategoryLoading(true);
//     try {
//         const result = await getAllCategories(); 
//         const categoryArray = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
//         setCategories(categoryArray); 
//     } catch (err) {
//         console.error("Failed to load categories:", err);
//         setCategories([]);
//     } finally {
//         setCategoryLoading(false);
//     }
//   }, []);
//   // -----------------------------

//   useEffect(() => {
//     fetchShops();
//     fetchCategories(); // Call to fetch categories on mount
//   }, [fetchShops, fetchCategories]);
  
//   const fetchUsers = useCallback(async () => {
//     setUserLoading(true);
//     try {
//       const result = await getAllUsersAPI(); 
//       const validUsers = Array.isArray(result.data) ? result.data.filter(u => u.fullName && u._id) : [];
//       setUsers(validUsers); 
//     } catch (err) {
//       console.error("Failed to load users:", err);
//     } finally {
//       setUserLoading(false);
//     }
//   }, []);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData(prev => ({ ...prev, [name]: files[0] || null }));
//   };

//   // --- RESTORED: Handle User Selection ---
//   const handleUserSelectChange = (e) => {
//     const userId = e.target.value;
//     setSelectedUserId(userId);
//     const user = users.find(u => u._id === userId);
    
//     if (user) {
//         setFormData(prev => ({
//             ...prev,
//             userId: user._id,
//             ownerName: user.fullName || '',
//             mobileNumber: user.mobile || '', 
//             whatsappNumber: user.mobile || '', 
//         }));
//     } else {
//         setFormData(prev => ({
//             ...prev,
//             userId: '',
//             ownerName: '',
//             mobileNumber: '',
//             whatsappNumber: '',
//         }));
//     }
//   };
//   // --------------------------------------

//   // --- NEW: Handle Category Selection ---
//   const handleCategorySelectChange = (e) => {
//     const categoryId = e.target.value;
//     setSelectedCategoryId(categoryId);
//     const category = categories.find(c => c._id === categoryId);
    
//     if (category) {
//         setFormData(prev => ({
//             ...prev,
//             category: category.name, // Storing name to match shop display
//         }));
//     } else {
//         setFormData(prev => ({
//             ...prev,
//             category: '',
//         }));
//     }
//   };
//   // --------------------------------------


//   const handleAction = async (type, shop = null) => {
//     setModalType(type);
//     setIsModalOpen(true);
    
//     if (type === 'create') {
//         setSelectedUserId(''); // Reset user selection
//         setSelectedCategoryId(''); // Reset category selection
//         setFormData(initialFormData); 
//         setSelectedShop(null); 
//         fetchUsers(); 
//         fetchCategories(); // Ensure categories are loaded
//         return;
//     }

//     if (type === 'view') {
//         setShopDetailLoading(true);
//         try {
//             const detailedData = await getShopDetailsById(shop._id);
//             setSelectedShop(detailedData);
//         } catch (err) {
//             alert("Failed to fetch shop details.");
//             setSelectedShop(shop);
//         } finally {
//             setShopDetailLoading(false);
//         }
//     } else {
//         setSelectedShop(shop);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedShop(null);
//     setFormData(initialFormData);
//     setSelectedUserId('');
//     setSelectedCategoryId('');
//   };
  
//   const handleSave = async () => {
//       if (!selectedShop || !modalType) return;
//       try {
//           setShops(prevShops => prevShops.map(shop => 
//             shop._id === selectedShop._id ? { ...shop, ...formData } : shop
//           ));
//           alert(`Action ${modalType} completed successfully (Simulated)!`);
//           closeModal();
//       } catch (err) {
//           alert(`Action failed: ${JSON.stringify(err.message || err)}`);
//       }
//   };

//   // --- MODIFIED: Use new API for creation ---
//   const handleCreateShop = async () => {
//     // MANDATORY FIELD CHECK: Now checking userId (via UserSelect), Category (via CategorySelect), and others
//     if (!formData.userId || !formData.businessName || !formData.ownerName || !formData.mobileNumber || !formData.category || !formData.location) {
//         alert("Please fill all mandatory fields (User Selection, Category Selection, Business Name, Owner Name, Mobile, Location).");
//         return;
//     }
    
//     try {
//         // Prepare FormData for file upload via the new API
//         const dataToSend = new FormData();
//         dataToSend.append('userId', formData.userId);
//         dataToSend.append('businessName', formData.businessName);
//         dataToSend.append('details', formData.details || '');
//         dataToSend.append('category', formData.category);
//         dataToSend.append('location', formData.location);
//         dataToSend.append('address', formData.address || '');
//         dataToSend.append('ownerName', formData.ownerName);
//         dataToSend.append('mobileNumber', formData.mobileNumber);
//         dataToSend.append('whatsappNumber', formData.whatsappNumber || '');

//         if (formData.businessImages) dataToSend.append('businessImages', formData.businessImages);
//         if (formData.nationalIdImage) dataToSend.append('nationalIdImage', formData.nationalIdImage);
//         if (formData.ownerImage) dataToSend.append('ownerImage', formData.ownerImage);

//         // Call the new API function
//         const result = await createNewShopAPI(dataToSend); 

//         if (result.success) {
//             // Assuming the new API response structure returns a newShop object similar to the old mock
//             setShops(prevShops => [result.newShop, ...prevShops]);
//             alert(result.message);
//             closeModal();
//         } else {
//             throw new Error(result.message || "Shop creation failed via API.");
//         }
//     } catch (err) {
//         // Handle API errors
//         const errorMessage = err.message || (err.data && err.data.message) || "An unknown error occurred during API call.";
//         alert(`Creation failed: ${errorMessage}`);
//     }
//   };
//   // ------------------------------------------
  
//   const handleDelete = async () => {
//       if (!selectedShop) return;
//       const shopIdToDelete = selectedShop._id; 
//       const shopName = selectedShop.businessName;

//       try {
//           await deletebusiness(shopIdToDelete); 
//           setShops(prevShops => prevShops.filter(shop => shop._id !== shopIdToDelete)); 
//           alert(`Shop '${shopName}' deleted successfully!`); 
//           closeModal();
//       } catch (err) {
//           const errorMessage = err.message || (err.data && err.data.message) || "An unknown error occurred during deletion.";
//           alert(`Deletion failed: ${errorMessage}`); 
//       }
//   };

//   const handleToggleStatus = async () => { 
//     if (!selectedShop) return;
//     const shopId = selectedShop._id;
//     const currentStatus = selectedShop.status;
    
//     const newStatus = currentStatus === 'Blocked' ? 'Approved' : 'Blocked'; 
//     const actionText = newStatus === 'Blocked' ? 'Block' : 'Unblock';

//     try {
//         await toggleBusinessStatusAPI(shopId, newStatus); 
        
//         setShops(prevShops => prevShops.map(shop => 
//             shop._id === shopId ? { ...shop, status: newStatus } : shop
//         ));

//         alert(`Shop '${selectedShop.businessName}' successfully set to ${newStatus}.`);
//         closeModal();
//     } catch (err) {
//         const errorMessage = err.message || (err.data && err.data.message) || `An unknown error occurred during ${actionText}.`;
//         alert(`${actionText} failed: ${errorMessage}`);
//     }
//   };


//   const filteredShops = Array.isArray(shops)
//     ? shops.filter(shop => {
//         if (activeFilter === "All") return true;
//         if (activeFilter === "Expired") return shop.status === "Expired";
//         if (activeFilter === "Blocked") return shop.status === "Blocked";
//         return shop.plan === activeFilter; 
//       })
//     : []; 

//   const renderContent = () => {
//       if (loading) return <LoadingState />;
//       if (error) return <ErrorState message={error} onRetry={fetchShops} />;
//       if (filteredShops.length === 0) return <EmptyState filter={activeFilter} />;
      
//       return (
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-white border-b border-slate-100">
//                 <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">#</th>
//                 <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shop Details</th>
//                 <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Owner Info</th>
//                 <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan Details</th>
//                 <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
//                 <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {filteredShops.map((shop, index) => ( 
//                 <tr key={shop._id} className="hover:bg-slate-50/80 transition-colors">
//                   <td className="p-4 text-sm font-medium text-slate-500">{index + 1}</td>
//                   <td className="p-4">
//                     <div className="flex flex-col">
//                       <span className="text-sm font-bold text-slate-800">{shop.businessName}</span>
//                       <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
//                         <MapPin size={10} /> {shop.location || 'N/A'} • {shop.category || 'N/A'}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-slate-700">{shop.ownerName || 'N/A'}</span>
//                       <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
//                         <Phone size={10} /> {shop.mobileNumber || 'N/A'}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex flex-col">
//                       <div className="flex items-center gap-2">
//                         <PlanBadge plan={shop.plan || 'Trial'} />
//                       </div>
//                       <span className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
//                         <Calendar size={12} /> {shop.expiry || 'Unknown'}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4 text-center">
//                     <StatusBadge status={shop.status || 'Blocked'} />
//                   </td>
//                   <td className="p-4">
//                     <div className="flex justify-end gap-1.5">
//                       <ActionButton icon={<Eye size={14}/>} color="blue" title="View Profile" onClick={() => handleAction('view', shop)} />
//                       <ActionButton icon={<Edit3 size={14}/>} color="amber" title="Edit Shop" onClick={() => handleAction('edit', shop)} />
//                       <ActionButton icon={<Clock size={14}/>} color="indigo" title="Extend Plan" onClick={() => handleAction('extend', shop)} />
//                       <ActionButton icon={<ArrowUpCircle size={14}/>} color="emerald" title="Upgrade" onClick={() => handleAction('upgrade', shop)} />
//                       <ActionButton 
//                         icon={<ShieldOff size={14}/>} 
//                         color={shop.status === 'Blocked' ? 'slate' : 'green'} 
//                         title={shop.status === 'Blocked' ? 'Unblock' : 'Block'} 
//                         onClick={() => handleAction('block', shop)} 
//                       />
//                       <ActionButton icon={<Trash2 size={14}/>} color="red" title="Delete" onClick={() => handleAction('delete', shop)} />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//   }

//   return (
//     <div className="p-6 bg-[#f8fafc] min-h-screen font-sans relative">
      
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-extrabold text-slate-800">Shop Management</h1>
//           <p className="text-slate-500 text-sm">Monitor plans, expiry, and shop status</p>
//         </div>
//         <div className="flex gap-2">
//           <button 
//             onClick={() => handleAction('create')}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
//           >
//             + Create New Shop
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-3 mb-6">
//         {["All", "Trial", "Lite", "Pro+", "Expired", "Blocked"].map((filter) => (
//           <button
//             key={filter}
//             onClick={() => setActiveFilter(filter)}
//             className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
//               activeFilter === filter
//                 ? "bg-slate-800 text-white border-slate-800"
//                 : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
//             }`}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search by Shop ID, Name or Owner..." 
//               className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//             />
//           </div>
//         </div>
//         {renderContent()}
//       </div>

//       {isModalOpen && (selectedShop || modalType === 'create') && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            
//           <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
//             <div className="flex justify-between items-center p-4 border-b border-slate-100">
//               <h3 className="text-lg font-bold text-slate-800">
//                 {modalType === 'create' ? 'Create New Shop' :
//                  modalType === 'view' ? 'Shop Details' : 
//                  modalType === 'edit' ? 'Edit Shop' : 
//                  modalType === 'block' ? (selectedShop.status === 'Blocked' ? 'Unblock Confirmation' : 'Block Confirmation') :
//                  'Manage Shop'}
//               </h3>
//               <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 max-h-[80vh] overflow-y-auto">
              
//               {modalType === 'view' && shopDetailLoading ? (
//                   <div className="flex flex-col items-center justify-center py-10">
//                       <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
//                       <p className="text-slate-500 font-medium">Fetching Business Details...</p>
//                   </div>
//               ) : (
//                   <>
//                       {(modalType === 'view' || modalType === 'edit') && selectedShop && (
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <ModalField label="User ID" value={selectedShop.userId} />
//                               <ModalField label="Business Name" value={selectedShop.businessName} />
//                               <ModalField label="Owner Name" value={selectedShop.ownerName} />
//                               <ModalField label="Mobile Number" value={selectedShop.mobileNumber} />
//                               <ModalField label="Category" value={selectedShop.category} />
//                               <ModalField label="City / Location" value={selectedShop.location} />
//                               <ModalField label="Address" value={selectedShop.address} fullWidth />
//                               <ModalField label="Plan Type" value={selectedShop.plan} />
//                               <ModalField label="Status" value={selectedShop.status} />
//                               <ModalField label="Description / Details" value={selectedShop.details} fullWidth />
//                           </div>
//                       )}

//                       {modalType === 'create' && (
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <UserSelect 
//                                 users={users} 
//                                 selectedUserId={selectedUserId} 
//                                 onChange={handleUserSelectChange} 
//                                 userLoading={userLoading}
//                               />
//                               <CategorySelect 
//                                 categories={categories} 
//                                 selectedCategoryId={selectedCategoryId} 
//                                 onChange={handleCategorySelectChange} 
//                                 categoryLoading={categoryLoading}
//                               />
                              
//                               <FormInput label="Business Name" name="businessName" value={formData.businessName} onChange={handleInputChange} required />
                              
//                               <FormInput label="Location (City)" name="location" value={formData.location} onChange={handleInputChange} required />
//                               <FormInput label="Address (Shop/Street)" name="address" value={formData.address} onChange={handleInputChange} fullWidth required />

//                               <FormInput label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
//                               <FormInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} type="tel" required />
//                               <FormInput label="WhatsApp Number (Optional)" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} type="tel" />
                              
//                               <FormInput label="Details / Description" name="details" value={formData.details} onChange={handleInputChange} type="textarea" fullWidth />

//                               <FileUploader label="Business Images" name="businessImages" selectedFile={formData.businessImages} onChange={handleFileChange} />
//                               <FileUploader label="National ID Image" name="nationalIdImage" selectedFile={formData.nationalIdImage} onChange={handleFileChange} />
//                               <FileUploader label="Owner Image" name="ownerImage" selectedFile={formData.ownerImage} onChange={handleFileChange} />

//                           </div>
//                       )}

//                       {modalType === 'delete' && selectedShop && (
//                           <div className="text-center py-4">
//                               <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//                               <h3 className="text-xl font-bold text-slate-800">Delete Shop?</h3>
//                               <p className="text-slate-500 mt-2">Are you sure you want to delete <b>{selectedShop.businessName}</b>?</p>
//                           </div>
//                       )}

//                       {modalType === 'block' && selectedShop && (
//                           <div className="text-center py-4">
//                               <ShieldOff size={48} className={`mx-auto mb-4 ${selectedShop.status === 'Blocked' ? 'text-emerald-500' : 'text-slate-500'}`} />
//                               <h3 className="text-xl font-bold text-slate-800">
//                                   {selectedShop.status === 'Blocked' ? 'Unblock Shop?' : 'Block Shop?'}
//                               </h3>
//                               <p className="text-slate-500 mt-2">
//                                   Are you sure you want to {selectedShop.status === 'Blocked' ? 'unblock' : 'block'} 
//                                   <b> {selectedShop.businessName}</b>? 
//                                   {selectedShop.status !== 'Blocked' && (
//                                     <span className="block text-red-500 font-semibold text-sm mt-1">
//                                       This will restrict user access immediately.
//                                     </span>
//                                   )}
//                               </p>
//                           </div>
//                       )}
//                   </>
//               )}
//             </div>

//             <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
//                <button 
//                   onClick={closeModal} 
//                   className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
//                >
//                  Cancel
//                </button>
               
//                {modalType === 'create' ? (
//                    <button onClick={handleCreateShop} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700">
//                      <Save size={16} className="mr-1 inline-block"/> Save New Shop
//                    </button>
//                ) : modalType === 'view' ? (
//                    <button 
//                      onClick={closeModal}
//                      className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors"
//                    >
//                      Close View
//                    </button>
//                ) : modalType === 'delete' ? (
//                    <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700">
//                      Confirm Delete
//                    </button>
//                ) : modalType === 'block' ? ( 
//                    <button 
//                      onClick={handleToggleStatus} 
//                      className={`px-6 py-2 text-white text-sm font-bold rounded-md transition-colors ${selectedShop.status === 'Blocked' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-600 hover:bg-slate-700'}`}
//                    >
//                      {selectedShop.status === 'Blocked' ? 'Confirm Unblock' : 'Confirm Block'}
//                    </button>
//                ) : (
//                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">
//                      Save Changes
//                    </button>
//                )}
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

