import React, { useState } from "react";
import { Search, Ban, CheckCircle, UserCircle } from "lucide-react";

const usersData = [
  {
    id: 101,
    name: "Rahul Sharma",
    photo: "",
    phone: "9712121212",
    gender: "Male",
    location: "Delhi",
    status: "Active",
    type: "Job Seeker",
    verified: true,
    credits: 120,
    joined: "2025-06-12",
    lastActive: "2 hours ago",
    blood: "O+",
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");

  const filteredUsers = usersData.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500">Complete control over all users</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-orange-200 bg-orange-50 focus:ring-2 focus:ring-orange-200 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-x-auto">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Profile</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Credits</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Last Active</th>
              <th className="px-4 py-3 text-left">Blood</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-orange-50">
                <td className="px-4 py-3">#{u.id}</td>
                <td className="px-4 py-3">
                  {u.photo ? (
                    <img src={u.photo} className="w-8 h-8 rounded-full" />
                  ) : (
                    <UserCircle className="text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">{u.gender}</td>
                <td className="px-4 py-3">{u.location}</td>
                <td className="px-4 py-3">{u.type}</td>
                <td className="px-4 py-3">
                  {u.verified ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={14} /> Verified
                    </span>
                  ) : (
                    <span className="text-gray-400">Not Verified</span>
                  )}
                </td>
                <td className="px-4 py-3">{u.credits}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">{u.joined}</td>
                <td className="px-4 py-3">{u.lastActive}</td>
                <td className="px-4 py-3">{u.blood || "-"}</td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                    <Ban size={14} /> Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
