import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit2, Lock, Unlock, Trash2, X } from 'lucide-react';
import { getAllAdminData, registerAdmin, searchAdminAPI, deleteAdminAPI } from "../../auth/adminLogin";

const UserTable = () => {
  // State for storing user data, loading, and error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the function from your controller file
        const response = await getAllAdminData();


        if (Array.isArray(response)) {
          setUsers(response);
        }
        // *** If your backend returns { data: [...] } (common pattern): ***
        else if (response && Array.isArray(response.data)) {
          setUsers(response.data);
        }
        // *** If your backend returns something else, you might need to adjust this logic ***
        else {
          // If the response structure is unknown or empty, set an error or default to empty array
          console.error("Unexpected response structure from getAllAdminData:", response);
          setUsers([]); // Set empty array as default safe value
        }

      } catch (err) {
        console.error("Failed to fetch admin data:", err);
        setError("Failed to load admin data. Please check the network or API.");
        setUsers([]); // Clear users on error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      const result = await registerAdmin(formData.name, formData.email, formData.password);
      if (result) {
        setToast({ visible: true, message: "Admin added successfully!" });
        setTimeout(() => setToast({ visible: false, message: "" }), 5000); setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '' });
        const updatedData = await getAllAdminData();
        setUsers(updatedData.data || updatedData);
      }
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  const handleSearch = async (val) => {
    setSearchQuery(val);
    try {
      if (val.trim() === '') {
        const res = await getAllAdminData();
        setUsers(res.data || res);
      } else {
        const res = await searchAdminAPI(val);
        setUsers(res.admins || []); // API response ke 'admins' array ko set karein
      }
    } catch (err) { console.error(err); }
  };
  // --- JSX Rendering ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {toast.visible && (
        <div className="fixed top-5 right-5 z-[2000] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold border border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
          ✅ {toast.message}
        </div>
      )}
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Admin</h1>
        <p className="text-gray-500">Manage all registered admin on the platform.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium">All Admin</button>
        <button className="px-6 py-2 bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-100">Service Providers</button>
        <button className="px-6 py-2 bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-100">Customers</button>
      </div>

      {/* Search and Add User Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/4">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search Admin..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus size={18} /> Add Admin
        </button>
      </div>

      {/* Table Section - Loading/Error State */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading && <div className="p-6 text-center text-indigo-600">Loading Admin...</div>}
        {error && <div className="p-6 text-center text-red-600 bg-red-50">{error}</div>}

        {!loading && !error && users.length === 0 && (
          <div className="p-6 text-center text-gray-500">No Admin found.</div>
        )}

        {/* Table Content - Only render if not loading and data exists */}
        {!loading && users.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
                <th className="px-6 py-4">S.NO</th>
                <th className="px-6 py-4">ADMIN NAME</th>
                <th className="px-6 py-4">EMAIL</th>
                <th className="px-6 py-4">ADMIN TYPE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        {/* Avatar Placeholder - Using user.id for seed */}
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        {/* Assuming 'phone' field exists in API response */}
                        <p className="text-xs text-gray-400">{user.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  {/* Assuming 'email' field exists in API response */}
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email || 'N/A'}</td>
                  {/* Assuming 'type' field exists in API response */}
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.type || 'UNKNOWN'}</td>
                  <td className="px-6 py-4">
                    {/* Assuming 'status' field exists in API response and is 'BLOCKED' or 'ACTIVE' */}
                    <span className={`px-3 py-1 rounded text-xs font-bold ${user.status === 'BLOCKED'
                      ? 'bg-red-50 text-red-400 border border-red-100'
                      : 'bg-green-50 text-green-500 border border-green-100'
                      }`}>
                      {user.status || 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4 text-gray-400">
                      <Edit2 size={18} className="cursor-pointer hover:text-blue-500" />
                      {/* Assuming the action logic should use the fetched status */}
                      {user.status === 'BLOCKED' ? (
                        <Unlock size={18} className="cursor-pointer text-green-500" />
                      ) : (
                        <Lock size={18} className="cursor-pointer text-yellow-500" />
                      )}
                      <Trash2 size={18} className="cursor-pointer hover:text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Register New Admin</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  required
                  type="password"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border rounded-lg font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={regLoading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                  {regLoading ? "Registering..." : "Register Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;