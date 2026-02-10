import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit2, Lock, Unlock, Trash2 } from 'lucide-react';
import { getAllAdminData } from "../../auth/adminLogin"; // This import is correct

const UserTable = () => {
  // State for storing user data, loading, and error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook to fetch data when the component mounts
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

  // --- JSX Rendering ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
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
                                <span className={`px-3 py-1 rounded text-xs font-bold ${
                                    user.status === 'BLOCKED' 
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
    </div>
  );
};

export default UserTable;