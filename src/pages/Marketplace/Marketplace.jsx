import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Star,
  X,
  ShoppingBag,
  DollarSign,
  Eye,
  MapPin,
  Loader2,
  AlertCircle,
  ImageOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateMarketplaceItemAPI, createMarketplaceItemAPI } from "../../auth/adminLogin";
const MarketplaceManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    sum: 0,
  });
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [newItem, setNewItem] = useState({});
const getCurrentLocation = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        setNewItem((prev) => ({
          ...prev,
          location: {
            address: data.display_name || "",
coordinates: [lat, lng],           },
        }));
      } catch (err) {
        console.log(err);
      }
    },
    (err) => console.log(err)
  );
};
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 5000);
  };

  const fetchMarketplaceData = async (page = currentPage) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://digiapp-node-1.onrender.com/api/admin/items/Items?page=${page}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json(); // ✅ अब result defined

      if (result.success) {
        setItems(result.data);

        setStats({
          total: result.totalItems || 0,
          active: result.activeItems || 0,
          featured: result.featuredItems || 0,
          sum: result.totalPriceSum || 0,
        });

        setTotalItems(result.totalItems || 0);
        setTotalPages(
          result.totalPages ||
            Math.ceil((result.totalItems || 0) / itemsPerPage),
        );
      } else {
        showToast("Failed to load data", "error");
      }
    } catch {
      showToast("Error fetching job list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData(currentPage);
  }, [currentPage]);


  const openEditModal = (item) => {
    setCurrentItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (!currentItem) return;
    setActionLoading(true);
    try {
      const result = await updateMarketplaceItemAPI(currentItem._id, {
        title: currentItem.title,
        price: currentItem.price,
        isActive: currentItem.isActive,
        isFeatured: currentItem.isFeatured,
        preferredCommunication: currentItem.preferredCommunication,
        images: currentItem.images,
        location: {
          address: currentItem.location?.address,
          coordinates: currentItem.location?.coordinates,
        },
      });
      if (result.success) {
        setItems(
          items.map((item) =>
            item._id === currentItem._id ? result.data : item,
          ),
        );
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
      const response = await fetch(
        `https://digiapp-node-1.onrender.com/api/admin/items/delete/${currentItem._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();
      if (result.success) {
        setItems(items.filter((item) => item._id !== currentItem._id));
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

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
const handleCreateItem = async () => {
  try {
    const formData = new FormData();

   Object.keys(newItem).forEach((key) => {
  if (key === "images") {
    newItem.images.forEach((img) => {
      formData.append("images", img);
    });
  } 
  else if (key === "location") {
    formData.append("location", JSON.stringify(newItem.location));
  } 
  else if (key === "preferredCommunication") {
    formData.append(key, newItem[key]); // already stringified
  } 
  else {
    formData.append(key, newItem[key]);
  }
});

    const result = await createMarketplaceItemAPI(formData);

    if (result.success) {
      setIsAddModalOpen(false);
      setNewItem({});
      fetchMarketplaceData(currentPage);
      showToast("Item created successfully", "success");
    } else {
      showToast(result.message || "Create failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Error creating item", "error");
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
          <p className="text-slate-500 text-sm">
            Real-time Marketplace Management
          </p>
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
            className="border border-indigo-200 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:bg-indigo-100 transition-colors mr-3"
          >
            <option value="Admin">Admin View</option>
            <option value="User">User View</option>
          </select>
        </div>
        <button
          onClick={() => fetchMarketplaceData(currentPage)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <Loader2 size={16} className={loading ? "animate-spin" : "hidden"} />
          Refresh List
        </button>
        <button
onClick={() => setIsAddModalOpen(true)}  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
>
  + Add New
</button>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-13 mt-13">
          {" "}
          <StatCard
            title="Total Items"
            value={stats.total}
            icon={<ShoppingBag size={20} />}
            color="blue"
          />
          <StatCard
            title="Active Items"
            value={stats.active}
            icon={<Eye size={20} />}
            color="emerald"
          />
          <StatCard
            title="Featured"
            value={stats.featured}
            icon={<Star size={20} />}
            color="amber"
          />
          <StatCard
            title="Total Sum"
            value={`₹${(stats.sum / 1000).toFixed(0)}k`}
            icon={<DollarSign size={20} />}
            color="indigo"
          />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-500 font-medium italic">
            Syncing with server...
          </p>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
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
                      {indexOfFirstItem + index + 1}
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
                            <MapPin size={10} />{" "}
                            {item.location?.address || "No Address"}
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
                      ₹{item.price.toLocaleString()}
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
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
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
            {items.length === 0 && (
              <div className="p-10 text-center text-slate-400 font-medium">
                No items found in database.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfFirstItem + items.length, totalItems)} of{" "}
              {totalItems} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && currentItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-indigo-600 border-b">
              <h2 className="text-lg font-bold text-center w-full">
                Edit Listing
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={currentItem.title || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, title: e.target.value })
                  }
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Price + Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Price</label>
                  <input
                    type="number"
                    value={currentItem.price || ""}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Active</label>
                  <select
                    value={currentItem.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        isActive: e.target.value === "true",
                      })
                    }
                    className="w-full p-2.5 border rounded-lg"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="block text-xs font-bold mb-1">Featured</label>
                <select
                  value={currentItem.isFeatured ? "true" : "false"}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      isFeatured: e.target.value === "true",
                    })
                  }
                  className="w-full p-2.5 border rounded-lg"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold mb-1">Address</label>
                <input
                  type="text"
                  value={currentItem.location?.address || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      location: {
                        ...currentItem.location,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={currentItem.location?.coordinates?.[0] || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      location: {
                        ...currentItem.location,
                        coordinates: [
                          e.target.value,
                          currentItem.location?.coordinates?.[1] || "",
                        ],
                      },
                    })
                  }
                  className="p-2.5 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={currentItem.location?.coordinates?.[1] || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      location: {
                        ...currentItem.location,
                        coordinates: [
                          currentItem.location?.coordinates?.[0] || "",
                          e.target.value,
                        ],
                      },
                    })
                  }
                  className="p-2.5 border rounded-lg"
                />
              </div>

              {/* Preferred Communication */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  Preferred Communication
                </label>
                <input
                  type="text"
                  value={currentItem.preferredCommunication || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      preferredCommunication: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file); // local preview
                      setCurrentItem({
                        ...currentItem,
                        images: [imageUrl],
                      });
                    }
                  }}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateConfirm}
                disabled={actionLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-70"
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

{isAddModalOpen && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

      {/* Header same as edit */}
      <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 border-b">
        <h2 className="text-lg font-bold text-center w-full">
          Add New Listing
        </h2>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body same structure */}
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

        <input placeholder="Title"
          onChange={(e)=>setNewItem({...newItem,title:e.target.value})}
          className="w-full p-2.5 border rounded-lg"
        />

        <input placeholder="Details"
          onChange={(e)=>setNewItem({...newItem,details:e.target.value})}
          className="w-full p-2.5 border rounded-lg"
        />

        <input placeholder="Category"
          onChange={(e)=>setNewItem({...newItem,category:e.target.value})}
          className="w-full p-2.5 border rounded-lg"
        />

        <input placeholder="SubCategory"
          onChange={(e)=>setNewItem({...newItem,subCategory:e.target.value})}
          className="w-full p-2.5 border rounded-lg"
        />
<button
  type="button"
  onClick={getCurrentLocation}
  className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
>
  Fetch Location
</button>
  <input
  placeholder="Address"
  value={newItem.location?.address || ""}
  onChange={(e) =>
    setNewItem({
      ...newItem,
      location: {
        ...newItem.location,
        address: e.target.value,
      },
    })
  }
  className="w-full p-2.5 border rounded-lg"
/>

<div className="grid grid-cols-2 gap-4">
  <input
    placeholder="Latitude"
    value={newItem.location?.coordinates?.[0] || ""}
    readOnly   // optional but recommended
    className="p-2.5 border rounded-lg"
  />

  <input
    placeholder="Longitude"
    value={newItem.location?.coordinates?.[1] || ""}
    readOnly   // optional but recommended
    className="p-2.5 border rounded-lg"
  />
</div>

     <select
onChange={(e)=>
  setNewItem({
    ...newItem,
    preferredCommunication: JSON.stringify({
      call: e.target.value === "call",
      chat: e.target.value === "chat"
    })
  })
}
>
  <option value="call">Call</option>
  <option value="chat">Chat</option>
</select>

        <select
          onChange={(e)=>setNewItem({...newItem,isActive:e.target.value==="true"})}
          className="w-full p-2.5 border rounded-lg"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          onChange={(e)=>setNewItem({...newItem,isFeatured:e.target.value==="true"})}
          className="w-full p-2.5 border rounded-lg"
        >
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>

        <input type="file"
          onChange={(e)=>setNewItem({...newItem,images:[e.target.files[0]]})}
          className="w-full p-2.5 border rounded-lg"
        />

      </div>

      {/* Footer same as edit */}
      <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="text-sm font-bold text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
       <button
  onClick={handleCreateItem}
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-bold"
>
  Add Item
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
              <h2 className="text-xl font-bold text-slate-800">
                Confirm Delete
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-700">
                  "{currentItem.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex flex-col gap-2">
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
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
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-transform hover:translate-y-[-2px]">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          {title}
        </p>
        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h2>
      </div>
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
    </div>
  );
};

export default MarketplaceManager;
