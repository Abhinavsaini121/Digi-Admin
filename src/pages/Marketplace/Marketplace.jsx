import React, { useState } from "react";
import { 
  Edit, Trash2, Star, Tag, CheckCircle, X, 
  ShoppingBag, DollarSign, Eye, MoreHorizontal 
} from "lucide-react";

// --- DUMMY DATA ---
const INITIAL_LISTINGS = [
  {
    id: 1,
    title: "iPhone 13 Pro Max",
    description: "256GB, Sierra Blue, Battery 92%",
    category: "Electronics",
    price: 65000,
    isFeatured: true,
    status: "Active",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    title: "Wooden Coffee Table",
    description: "Teak wood, 2 years old, minor scratches",
    category: "Furniture",
    price: 4500,
    isFeatured: false,
    status: "Active",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    title: "Royal Enfield Classic 350",
    description: "2021 Model, 15k kms driven",
    category: "Vehicles",
    price: 180000,
    isFeatured: true,
    status: "Sold",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 4,
    title: "Study Table & Chair",
    description: "Ergonomic chair with white desk",
    category: "Furniture",
    price: 8000,
    isFeatured: false,
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1519643381401-22c779110e8e?auto=format&fit=crop&q=80&w=200"
  },
];

const Marketplace = () => {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);

  // --- Actions ---

  // Toggle Featured Status
  const toggleFeatured = (id) => {
    setListings(listings.map(item => 
      item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
    ));
  };

  // Delete Listing
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings(listings.filter(item => item.id !== id));
    }
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setCurrentListing({ ...item });
    setIsModalOpen(true);
  };

  // Save Changes (Simulated)
  const handleSave = () => {
    setListings(listings.map(item => 
      item.id === currentListing.id ? currentListing : item
    ));
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Marketplace Listings
          </h1>
          <p className="text-slate-500 text-sm">Manage Buy/Sell products, categories & status</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-all active:scale-95">
          + Add New Listing
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Listings" value={listings.length} icon={<ShoppingBag size={20} />} color="blue" />
        <StatCard title="Active Listings" value={listings.filter(i => i.status === 'Active').length} icon={<Eye size={20} />} color="emerald" />
        <StatCard title="Featured Items" value={listings.filter(i => i.isFeatured).length} icon={<Star size={20} />} color="amber" />
        <StatCard title="Total Value" value={`₹${(listings.reduce((acc, curr) => acc + curr.price, 0) / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} color="indigo" />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Details</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Featured</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* 1. Title & Details (Image included) */}
                  <td className="p-4 align-top max-w-[300px]">
                    <div className="flex items-start gap-3">
                      <img 
                        src={item.image} 
                        alt="product" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm mb-0.5">{item.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* 2. Category */}
                  <td className="p-4 align-top">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Tag size={12} /> {item.category}
                    </span>
                  </td>

                  {/* 3. Price */}
                  <td className="p-4 align-top font-bold text-slate-700 text-sm">
                    ₹{item.price.toLocaleString()}
                  </td>

                  {/* 4. Featured Toggle */}
                  <td className="p-4 align-top text-center">
                    <button 
                      onClick={() => toggleFeatured(item.id)}
                      className={`p-1 rounded-full transition-all ${item.isFeatured ? 'text-amber-400 hover:text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      <Star size={18} fill={item.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>

                  {/* 5. Status */}
                  <td className="p-4 align-top text-center">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* 6. Admin Actions (Edit / Delete) */}
                  <td className="p-4 align-top text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100 transition-all"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {listings.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No listings found.
            </div>
          )}
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && currentListing && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <h2 className="text-lg font-bold text-slate-800">Edit Listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Title</label>
                <input 
                  type="text" 
                  value={currentListing.title}
                  onChange={(e) => setCurrentListing({...currentListing, title: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select 
                    value={currentListing.category}
                    onChange={(e) => setCurrentListing({...currentListing, category: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Vehicles</option>
                    <option>Fashion</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={currentListing.price}
                    onChange={(e) => setCurrentListing({...currentListing, price: parseInt(e.target.value)})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select 
                    value={currentListing.status}
                    onChange={(e) => setCurrentListing({...currentListing, status: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Sold">Sold</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={currentListing.isFeatured}
                      onChange={(e) => setCurrentListing({...currentListing, isFeatured: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Mark as Featured</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* --- Reusable Components --- */

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</p>
        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h2>
      </div>
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        {icon}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700",
    Sold: "bg-slate-100 text-slate-600",
    Inactive: "bg-red-100 text-red-700"
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${styles[status] || styles.Inactive}`}>
      {status}
    </span>
  );
};

export default Marketplace;