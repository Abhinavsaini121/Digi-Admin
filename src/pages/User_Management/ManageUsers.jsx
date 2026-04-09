import React, { useState, useEffect } from "react";
import {
  Search, Ban, CheckCircle, UserCircle,
  Edit, Trash2, X, Save, Phone, MessageCircle
} from "lucide-react";
import { getAllMasterUsers, updateUserProfileAPI, deleteUserAPI, searchUsersAPI } from "../../auth/adminLogin";

import toast, { Toaster } from 'react-hot-toast';
export default function UserMasterProfile() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: "" });
  useEffect(() => {
    fetchUsers();
  }, []);


  const mapUserData = (apiData) => {
    return apiData.map(u => ({
      id: u._id,
      name: u.fullName || u.name || "Unknown User",
      photo: u.profilePhoto || "",
      mobile: u.mobile || "N/A",
      whatsapp: u.mobile || "N/A",
      gender: u.gender,
      location: typeof u.location === 'object' ? u.location.address || "Point" : u.location,
      blood: u.bloodGroup,
      role: u.role,
      credits: u.credits,
      status: u.status,
      joined: new Date(u.createdAt).toLocaleDateString(),
      lastActive: new Date(u.updatedAt).toLocaleString()
    }));
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllMasterUsers();
      if (response.success) {
        // Mapping API fields to your Component fields
        const mappedData = response.data.map(u => ({
          id: u._id,
          name: u.fullName || u.name || "Unknown User",
          photo: u.profilePhoto || "",
          mobile: u.mobile || "N/A",
          whatsapp: u.mobile || "N/A", // API doesn't have whatsapp separately
          gender: u.gender,
          location: typeof u.location === 'object' ? u.location.address || "Point" : u.location,
          blood: u.bloodGroup,
          role: u.role,
          credits: u.credits,
          status: u.status,
          joined: new Date(u.createdAt).toLocaleDateString(),
          lastActive: new Date(u.updatedAt).toLocaleString()
        }));
        setUsers(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };
  const [search, setSearch] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (search.trim() !== "") {
        try {
          // Note: mapUserData function fetchUsers ke upar define honi chahiye
          const response = await searchUsersAPI(search);
          if (response.status) {
            const mapped = response.data.map(u => ({
              id: u._id,
              name: u.fullName || u.name || "Unknown User",
              photo: u.profilePhoto || "",
              mobile: u.mobile || "N/A",
              whatsapp: u.mobile || "N/A",
              gender: u.gender,
              location: typeof u.location === 'object' ? u.location.address || "Point" : u.location,
              blood: u.bloodGroup,
              role: u.role,
              credits: u.credits,
              status: u.status,
              joined: new Date(u.createdAt).toLocaleDateString(),
              lastActive: new Date(u.updatedAt).toLocaleString()
            }));
            setUsers(mapped);
          }
        } catch (error) {
          console.error("Search failed", error);
        }
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);
  // State for Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Filter Logic
  const filteredUsers = users;

  // --- ACTIONS ---

  // 1. Delete User
  const handleDelete = (user) => {
    setDeleteModal({ isOpen: true, userId: user.id, userName: user.name });
  };

  const confirmDelete = async () => {
    try {
      const loadingToast = toast.loading("Deleting user...");
      await deleteUserAPI(deleteModal.userId);
      setUsers(users.filter((u) => u.id !== deleteModal.userId));
      toast.success("User deleted successfully!", { id: loadingToast });
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeleteModal({ isOpen: false, userId: null, userName: "" });
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

  const handleSaveUser = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", currentUser.name);
      formData.append("mobile", currentUser.mobile);
      formData.append("gender", currentUser.gender);
      formData.append("bloodGroup", currentUser.blood);
      formData.append("role", currentUser.role);
      formData.append("credits", currentUser.credits);

      if (currentUser.profileImageFile) {
        formData.append("profilePhoto", currentUser.profileImageFile);
      }

      // Ek "Loading" toast dikhayega jab tak update ho raha hai
      const loadingToast = toast.loading("Updating profile...");

      const response = await updateUserProfileAPI(currentUser.id, formData);

      if (response.status) {
        toast.success("Profile updated successfully!", { id: loadingToast }); // Success message
        fetchUsers();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile"); // Error message
    }
  };
  // Handle Input Changes in Modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen font-sans">
      <Toaster position="top-right" reverseOrder={false} />
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
              <th className="px-4 py-4 text-left">SNo.</th>
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
            {filteredUsers.map((u, index) => (
              <tr key={u.id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${u.status === "Active"
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
                      className={`p-2 rounded-lg transition-colors ${u.status === "Active"
                        ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      title={u.status === "Active" ? "Block User" : "Unblock User"}
                    >
                      {u.status === "Active" ? <Ban size={16} /> : <CheckCircle size={16} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(u)}
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

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Trash2 size={18} className="text-red-500" /> Delete User
              </h2>
              <button onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: "" })}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={26} className="text-red-500" />
              </div>
              <p className="text-gray-700 font-semibold text-base mb-1">
                Are you sure?
              </p>
              <p className="text-gray-500 text-sm">
                You are about to permanently delete{" "}
                <span className="font-bold text-red-600">{deleteModal.userName}</span>.
                This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button
                onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: "" })}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Trash2 size={16} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCurrentUser({ ...currentUser, profileImageFile: e.target.files[0] })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-sm"
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
                  {/* Value wahi rakhein jo backend accept karta hai */}
                  <option value="GENERAL_USER">Job Seeker (General User)</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ADMIN">Admin</option>
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