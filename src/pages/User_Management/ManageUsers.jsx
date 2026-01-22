import React, { useState } from "react";
import { 
  Search, Ban, CheckCircle, UserCircle, 
  Edit, Trash2, X, Save, Phone, MessageCircle 
} from "lucide-react";

// Initial Data based on your requirements
const initialUsers = [
  {
    id: 101,
    name: "Rahul Sharma",
    photo: "", // Empty string implies default placeholder
    mobile: "9712121212",
    whatsapp: "9712121212",
    gender: "Male",
    location: "Delhi",
    blood: "O+",
    role: "Job Seeker", // Role
    credits: 120,
    status: "Active",
    joined: "2025-06-12",
    lastActive: "2026-01-21 10:30 AM",
  },
  {
    id: 102,
    name: "Priya Singh",
    photo: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    mobile: "9876543210",
    whatsapp: "9876543210",
    gender: "Female",
    location: "Mumbai",
    blood: "B+",
    role: "Recruiter",
    credits: 500,
    status: "Blocked",
    joined: "2025-07-01",
    lastActive: "Yesterday",
  },
];

export default function UserMasterProfile() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  
  // State for Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Filter Logic
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- ACTIONS ---

  // 1. Delete User
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // 2. Block/Unblock User
  const handleBlockToggle = (id) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return { ...user, status: user.status === "Active" ? "Blocked" : "Active" };
        }
        return user;
      })
    );
  };

  // 3. Edit User (Open Modal)
  const handleEditClick = (user) => {
    setCurrentUser({ ...user }); // Create a copy to edit
    setIsModalOpen(true);
  };

  // 4. Save Changes (From Modal)
  const handleSaveUser = () => {
    setUsers(users.map((u) => (u.id === currentUser.id ? currentUser : u)));
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  // Handle Input Changes in Modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  return (
    <div className="p-6 bg-orange-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master User Profile</h1>
          <p className="text-sm text-gray-500">Admin View - Manage all user details</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-x-auto">
        <table className="min-w-[1400px] w-full text-sm">
          <thead className="bg-orange-100/50 text-gray-700 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-4 text-left">ID</th>
              <th className="px-4 py-4 text-left">Profile</th>
              <th className="px-4 py-4 text-left">Name</th>
              <th className="px-4 py-4 text-left">Contact Info</th>
              <th className="px-4 py-4 text-left">Role & Gender</th>
              <th className="px-4 py-4 text-left">Location</th>
              <th className="px-4 py-4 text-left">Blood</th>
              <th className="px-4 py-4 text-left">Credits</th>
              <th className="px-4 py-4 text-left">Dates</th>
              <th className="px-4 py-4 text-left">Status</th>
              <th className="px-4 py-4 text-center">Admin Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-orange-50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3 text-gray-500">#{u.id}</td>
                
                {/* Profile Photo */}
                <td className="px-4 py-3">
                  {u.photo ? (
                    <img src={u.photo} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-orange-200" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gray-300" />
                  )}
                </td>

                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                
                {/* Contact Info (Mobile & WhatsApp) */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Phone size={12} /> {u.mobile}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <MessageCircle size={12} /> {u.whatsapp}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{u.role}</span>
                    <span className="text-xs text-gray-500">{u.gender}</span>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-600">{u.location}</td>
                <td className="px-4 py-3 text-gray-600 font-medium">{u.blood || "-"}</td>
                <td className="px-4 py-3 font-bold text-orange-600">{u.credits}</td>
                
                {/* Dates */}
                <td className="px-4 py-3 text-xs text-gray-500">
                  <div>Joined: {u.joined}</div>
                  <div>Active: {u.lastActive}</div>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      u.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                {/* Admin Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {/* Edit */}
                    <button 
                      onClick={() => handleEditClick(u)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Fields"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Block/Unblock */}
                    <button 
                      onClick={() => handleBlockToggle(u.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        u.status === "Active" 
                        ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                      title={u.status === "Active" ? "Block User" : "Unblock User"}
                    >
                      {u.status === "Active" ? <Ban size={16} /> : <CheckCircle size={16} />}
                    </button>

                    {/* Delete */}
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Permanently Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Edit User Profile</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Grid Form */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              
              {/* Photo URL */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Profile Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  value={currentUser.photo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                  placeholder="Paste image link here"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentUser.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Role</label>
                <select
                  name="role"
                  value={currentUser.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm bg-white"
                >
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={currentUser.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={currentUser.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
                <input
                  type="text"
                  name="location"
                  value={currentUser.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Gender</label>
                <select
                  name="gender"
                  value={currentUser.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Blood Group</label>
                <select
                  name="blood"
                  value={currentUser.blood}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Credits Balance</label>
                <input
                  type="number"
                  name="credits"
                  value={currentUser.credits}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                />
              </div>

              {/* Read Only Fields */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <label className="text-xs text-gray-400 block">Joined Date</label>
                  <p className="text-sm font-medium text-gray-600">{currentUser.joined}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block">Last Active</label>
                  <p className="text-sm font-medium text-gray-600">{currentUser.lastActive}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}