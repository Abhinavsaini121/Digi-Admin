
import React, { useState, useEffect } from "react";
import {
  Edit, Trash2, Star, X,
  ShoppingBag, DollarSign, Eye, MapPin, Loader2, AlertCircle, ImageOff, AlertTriangle, CheckCircle
} from "lucide-react";

const MarketplaceManager = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    sum: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 5000);
  };

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://digiapp-node-1.onrender.com/api/admin/items/Items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setItems(result.data);
        setStats({
          total: result.totalItems || 0,
          active: result.activeItems || 0,
          featured: result.featuredItems || 0,
          sum: result.totalPriceSum || 0
        });
      } else {
        setError("Failed to load data");
      }
    } catch (err) {
      setError("API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const openEditModal = (item) => {
    setCurrentItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (!currentItem) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://digiapp-node-1.onrender.com/api/admin/items/update/${currentItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: currentItem.title,
          price: currentItem.price,
          isActive: currentItem.isActive,
          category: currentItem.category
        })
      });

      const result = await response.json();
      if (result.success) {
        setItems(items.map(item => item._id === currentItem._id ? result.data : item));
        setIsEditModalOpen(false);
        setCurrentItem(null);
        showToast("Updated successfully", "success");
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (err) {
      alert("Error updating item: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentItem) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://digiapp-node-1.onrender.com/api/admin/items/delete/${currentItem._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setItems(items.filter(item => item._id !== currentItem._id));
        setIsDeleteModalOpen(false);
        setCurrentItem(null);
        showToast("Deleted successfully", "success");
      } else {
        alert("Failed to delete item: " + result.message);
      }
    } catch (err) {
      alert("Error deleting item: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900 relative">

      {toast.visible && (
        <div className="fixed top-5 right-5 z-[1100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-white font-bold ${toast.type === "success" ? "bg-emerald-600 border-emerald-400" : "bg-red-600 border-red-400"}`}>
            {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm tracking-wide">{toast.message}</p>
            <button onClick={() => setToast({ ...toast, visible: false })} className="ml-2 hover:opacity-70"><X size={16} /></button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">MarketPlace Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time Marketplace Management</p>
        </div>
        <button
          onClick={fetchMarketplaceData}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <Loader2 size={16} className={loading ? "animate-spin" : "hidden"} />
          Refresh List
        </button>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Items" value={stats.total} icon={<ShoppingBag size={20} />} color="blue" />
          <StatCard title="Active Items" value={stats.active} icon={<Eye size={20} />} color="emerald" />
          <StatCard title="Featured" value={stats.featured} icon={<Star size={20} />} color="amber" />
          <StatCard title="Total Sum" value={`₹${(stats.sum / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} color="indigo" />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-500 font-medium italic">Syncing with server...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100 text-red-600">
          <AlertCircle size={40} className="mx-auto mb-2" />
          <p className="font-bold">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">Product Info</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Featured</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 max-w-xs">
                      <div className="flex gap-3">
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} className="w-12 h-12 rounded-lg object-cover border" alt="" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border"><ImageOff size={16} /></div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {item.location?.address || "No Address"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm text-slate-700">₹{item.price.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <Star size={18} className={item.isFeatured ? "text-amber-400 fill-amber-400 mx-auto" : "text-slate-200 mx-auto"} />
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit size={16} /></button>
                        <button onClick={() => openDeleteModal(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <div className="p-10 text-center text-slate-400 font-medium">No items found in database.</div>}
          </div>
        </div>
      )}

      {isEditModalOpen && currentItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Edit Listing</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  value={currentItem.title}
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: parseInt(e.target.value) })}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={currentItem.category}
                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Active Status</label>
                <select
                  value={currentItem.isActive ? "true" : "false"}
                  onChange={(e) => setCurrentItem({ ...currentItem, isActive: e.target.value === "true" })}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button
                onClick={handleUpdateConfirm}
                disabled={actionLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-70"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && currentItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Confirm Delete</h2>
              <p className="text-slate-500 mt-2 text-sm">
                Are you sure you want to delete <span className="font-bold text-slate-700">"{currentItem.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex flex-col gap-2">
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {actionLoading ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={actionLoading}
                className="w-full bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-transform hover:translate-y-[-2px]">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</p>
        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h2>
      </div>
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
    </div>
  );
};

export default MarketplaceManager;