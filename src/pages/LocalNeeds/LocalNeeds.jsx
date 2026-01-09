import React from "react";

const LocalNeeds = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Local Needs (Tasks) Management
        </h1>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View Category Stats
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value="1245" />
        <StatCard title="Active Tasks" value="820" />
        <StatCard title="Expired Tasks" value="310" />
        <StatCard title="Featured Tasks" value="115" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Task ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Image</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Posted By</th>
              <th className="p-3">Call No.</th>
              <th className="p-3">Unlocks</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">#LN1023</td>

              <td className="p-3">
                Electrician Needed
                <p className="text-xs text-gray-500">Wiring work for 2BHK</p>
              </td>

              {/* Image Column */}
              <td className="p-3">
                <img
                  src="https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2lybHxlbnwwfHwwfHx8MA%3D%3D"
                  alt="task"
                  className="w-14 h-14 rounded-lg object-cover border"
                />
              </td>

              <td className="p-3">Home Services</td>

              <td className="p-3">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  Active
                </span>
              </td>

              <td className="p-3">Rahul Sharma</td>
              <td className="p-3">9876543210</td>
              <td className="p-3">23</td>

              <td className="p-3">
                <span className="text-blue-600 font-semibold">Yes</span>
              </td>

              <td className="p-3 flex gap-2">
                <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs bg-red-500 text-white rounded">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
  </div>
);

export default LocalNeeds;
