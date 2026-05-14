import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Star,
  X,
  Loader2,
  AlertCircle,
  ImageOff,
  AlertTriangle,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { getAllUserItems, deleteUserItem } from "../../auth/adminLogin";
import { useNavigate, useLocation } from "react-router-dom";
const UserMarketPlace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(
      () => setToast({ visible: false, message: "", type: "success" }),
      3000,
    );
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAllUserItems(page);
      setItems(data.data || []);
      setPagination(data.pagination || null);
      setStats(data); 
    } catch (err) {
      showToast(err.message || "Failed to fetch items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentItem) return;
    setActionLoading(true);
    try {
      await deleteUserItem(currentItem._id);
      setItems(items.filter((item) => item._id !== currentItem._id));
      setIsDeleteModalOpen(false);
      setCurrentItem(null);
      showToast("Item deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900 relative">
      {toast.visible && (
        <div className="fixed top-5 right-5 z-[1100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-white font-bold ${toast.type === "success" ? "bg-emerald-600 border-emerald-400" : "bg-red-600 border-red-400"}`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="text-sm tracking-wide">{toast.message}</p>
            <button
              onClick={() => setToast({ ...toast, visible: false })}
              className="ml-2 hover:opacity-70"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            MarketPlace Dashboard
          </h1>
        </div>
        <div className="flex justify-end flex-1">
          <select
            value={location.pathname === "/user-marketplace" ? "User" : "Admin"}
            onChange={(e) => {
              if (e.target.value === "Admin") {
                navigate("/Marketplace");
              } else if (e.target.value === "User") {
                navigate("/user-marketplace");
              }
            }}
            className="border-2 border-indigo-500 px-5 py-2 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 outline-none focus:ring-2 focus:ring-indigo-400 shadow-md cursor-pointer hover:bg-indigo-100 transition-all"
          >
            <option value="Admin">Admin View</option>
            <option value="User"> User View</option>
          </select>
        </div>
      </div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs font-semibold opacity-80">TOTAL ITEMS</p>
    <p className="text-3xl font-extrabold mt-2">{stats?.totalItems || 0}</p>
  </div>

  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs font-semibold opacity-80">ACTIVE ITEMS</p>
    <p className="text-3xl font-extrabold mt-2">{stats?.activeItems || 0}</p>
  </div>

  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs font-semibold opacity-80">FEATURED</p>
    <p className="text-3xl font-extrabold mt-2">{stats?.isFeatured || 0}</p>
  </div>

  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs font-semibold opacity-80">TOTAL SUM</p>
    <p className="text-3xl font-extrabold mt-2">
      ₹{(stats?.totalPriceSum || 0).toLocaleString()}
    </p>
  </div>

</div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-15">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-400 flex items-center justify-center gap-2 mt-13">
              <Loader2 size={20} className="animate-spin" /> Loading items...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    Product Info
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    Price
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">
                    Featured
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 text-sm font-bold text-slate-500 w-12">
                      {(page - 1) * (pagination?.pageSize || 10) + index + 1}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="flex gap-3">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            className="w-12 h-12 rounded-lg object-cover border"
                            alt=""
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border">
                            <ImageOff size={16} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-slate-800 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {item.location?.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm text-slate-700">
                      ₹{item.price?.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <Star
                        size={18}
                        className={
                          item.isFeatured
                            ? "text-amber-400 fill-amber-400 mx-auto"
                            : "text-slate-200 mx-auto"
                        }
                      />
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && items.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-medium">
              No items available in the list.
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-slate-100">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded border disabled:opacity-40 hover:bg-slate-100"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm font-semibold">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, pagination.totalPages))
              }
              disabled={page === pagination.totalPages}
              className="px-3 py-1 text-sm rounded border disabled:opacity-40 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isDeleteModalOpen && currentItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Confirm Delete
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Delete{" "}
                <span className="font-bold text-slate-700">
                  "{currentItem.title}"
                </span>
                ?
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex flex-col gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Confirm Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl font-bold text-sm"
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

export default UserMarketPlace;
