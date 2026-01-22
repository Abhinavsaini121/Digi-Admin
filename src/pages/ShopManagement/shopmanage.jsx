import React, { useState } from "react";
import { 
  Search, Filter, Eye, Edit3, ShieldOff, Trash2, 
  Calendar, ArrowUpCircle, MapPin, Phone, X,
  CheckCircle2, AlertCircle, Clock, Save, Image as ImageIcon
} from "lucide-react";

const ShopListManagement = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  
  // State for controlling Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view', 'edit', 'delete', 'block', 'upgrade'
  const [selectedShop, setSelectedShop] = useState(null);

  // Dummy Data
  const shops = [
    {
      id: "SH-101",
      name: "Modern Electronics",
      description: "Best electronics shop in Mumbai offering mobile phones and laptops.",
      owner: "Rahul Sharma",
      mobile: "+91 98765 43210",
      plan: "Pro+",
      expiry: "2024-12-20",
      status: "Active",
      city: "Mumbai",
      category: "Electronics"
    },
    {
      id: "SH-102",
      name: "Organic Groceries",
      description: "Fresh farm organic vegetables and daily needs.",
      owner: "Anjali Gupta",
      mobile: "+91 88776 55443",
      plan: "Lite",
      expiry: "2024-05-10",
      status: "Expired",
      city: "Delhi",
      category: "Grocery"
    },
    {
      id: "SH-103",
      name: "Royal Furniture",
      description: "Premium wood furniture for home and office.",
      owner: "Vikram Singh",
      mobile: "+91 77665 54433",
      plan: "Trial",
      expiry: "2024-02-15",
      status: "Blocked",
      city: "Pune",
      category: "Furniture"
    }
  ];

  // Handler to open specific modal
  const handleAction = (type, shop) => {
    setModalType(type);
    setSelectedShop(shop);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShop(null);
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Shop Management</h1>
          <p className="text-slate-500 text-sm">Monitor plans, expiry, and shop status</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
            + Create New Shop
          </button>
        </div>
      </div>

      {/* --- STATS FILTERS --- */}
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

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Search Bar */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shop Details</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Owner Info</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan Details</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shops.map((shop) => (
                <tr key={shop.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Shop Details */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-blue-600 mb-0.5">{shop.id}</span>
                      <span className="text-sm font-bold text-slate-800">{shop.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {shop.city} • {shop.category}
                      </span>
                    </div>
                  </td>

                  {/* Owner Info */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{shop.owner}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Phone size={10} /> {shop.mobile}
                      </span>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <PlanBadge plan={shop.plan} />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                        <Calendar size={12} /> {shop.expiry}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <StatusBadge status={shop.status} />
                  </td>

                  {/* Actions (ALWAYS VISIBLE NOW) */}
                  <td className="p-4">
                    <div className="flex justify-end gap-1.5">
                      <ActionButton 
                        icon={<Eye size={14}/>} color="blue" title="View Profile" 
                        onClick={() => handleAction('view', shop)} 
                      />
                      <ActionButton 
                        icon={<Edit3 size={14}/>} color="amber" title="Edit Shop" 
                        onClick={() => handleAction('edit', shop)}
                      />
                      <ActionButton 
                        icon={<Clock size={14}/>} color="indigo" title="Extend Plan" 
                        onClick={() => handleAction('extend', shop)}
                      />
                      <ActionButton 
                        icon={<ArrowUpCircle size={14}/>} color="emerald" title="Upgrade" 
                        onClick={() => handleAction('upgrade', shop)}
                      />
                      <ActionButton 
                        icon={<ShieldOff size={14}/>} color="slate" title="Block" 
                        onClick={() => handleAction('block', shop)}
                      />
                      <ActionButton 
                        icon={<Trash2 size={14}/>} color="red" title="Delete" 
                        onClick={() => handleAction('delete', shop)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DYNAMIC MODAL / POPUP --- */}
      {isModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 capitalize">
                {modalType === 'view' && "Shop Profile"}
                {modalType === 'edit' && "Edit Details"}
                {modalType === 'delete' && "Delete Shop"}
                {modalType === 'block' && "Block Shop"}
                {modalType === 'upgrade' && "Upgrade Subscription"}
                {modalType === 'extend' && "Extend Validity"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full border border-slate-200">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Switches based on Action */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* VIEW PROFILE MODE */}
              {modalType === 'view' && (
                <div className="space-y-6">
                  <div className="text-center">
                     <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 font-bold text-2xl mb-3 border-4 border-blue-50">
                        {selectedShop.name.charAt(0)}
                     </div>
                     <h2 className="text-xl font-bold text-slate-800">{selectedShop.name}</h2>
                     <p className="text-sm text-slate-500">{selectedShop.id}</p>
                     <StatusBadge status={selectedShop.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Owner</p>
                      <p className="text-sm font-semibold text-slate-700">{selectedShop.owner}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-xs text-slate-400 font-bold uppercase">Mobile</p>
                       <p className="text-sm font-semibold text-slate-700">{selectedShop.mobile}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Description</p>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedShop.description}</p>
                  </div>
                </div>
              )}

              {/* EDIT MODE */}
              {modalType === 'edit' && (
                 <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Shop Name</label>
                        <input type="text" defaultValue={selectedShop.name} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Owner Mobile</label>
                        <input type="text" defaultValue={selectedShop.mobile} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                        <select className="w-full mt-1 p-2 border rounded-lg text-sm">
                            <option>Mumbai</option>
                            <option>Delhi</option>
                        </select>
                    </div>
                 </div>
              )}

              {/* DELETE WARNING */}
              {modalType === 'delete' && (
                 <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Are you sure?</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        This will permanently delete <span className="font-bold text-slate-800">{selectedShop.name}</span>. This action cannot be undone.
                    </p>
                 </div>
              )}

              {/* UPGRADE PLAN */}
              {modalType === 'upgrade' && (
                 <div className="space-y-3">
                    <p className="text-sm text-slate-600 mb-2">Current Plan: <span className="font-bold">{selectedShop.plan}</span></p>
                    {['Lite', 'Pro', 'Pro+'].map((plan) => (
                        <div key={plan} className={`p-3 border rounded-xl flex justify-between items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${plan === selectedShop.plan ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                            <span className="font-bold text-slate-700">{plan} Plan</span>
                            <span className="text-xs text-blue-600 font-bold">Select</span>
                        </div>
                    ))}
                 </div>
              )}

            </div>

            {/* Modal Footer / Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">
                 Cancel
               </button>
               
               {modalType === 'delete' ? (
                   <button className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100">
                     Yes, Delete
                   </button>
               ) : (
                   <button className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2">
                     <Save size={16} /> Save Changes
                   </button>
               )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/* --- Mini Components (Unchanged) --- */

const PlanBadge = ({ plan }) => {
  const styles = {
    "Pro+": "bg-purple-100 text-purple-700 border-purple-200",
    "Lite": "bg-blue-100 text-blue-700 border-blue-200",
    "Trial": "bg-slate-100 text-slate-700 border-slate-200"
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase ${styles[plan]}`}>
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
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : status === 'Expired' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
      {status}
    </span>
  );
};

// Updated ActionButton to accept onClick
const ActionButton = ({ icon, color, title, onClick }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
    red: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    slate: "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100",
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

export default ShopListManagement;