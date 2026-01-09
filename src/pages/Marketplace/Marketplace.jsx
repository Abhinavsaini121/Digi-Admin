import React from "react";

const Marketplace = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Marketplace (Buy / Sell) Management
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Listings" value="1,520" />
        <StatCard title="Active Listings" value="980" />
        <StatCard title="Expired Listings" value="410" />
        <StatCard title="Featured Listings" value="130" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Image</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50">
              {/* Product Details */}
              <td className="p-3">
                <p className="font-semibold">iPhone 12</p>
                <p className="text-xs text-gray-500">
                  128GB • Excellent Condition
                </p>
              </td>

              {/* Image */}
              <td className="p-3">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
                  alt="product"
                  className="w-14 h-14 rounded-lg object-cover border"
                />
              </td>

              {/* Price */}
              <td className="p-3 font-semibold text-gray-800">
                ₹45,000
              </td>

              {/* Status */}
              <td className="p-3">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  Active
                </span>
              </td>

              {/* Featured */}
              <td className="p-3">
                <span className="text-blue-600 font-semibold">
                  Yes
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 flex flex-wrap gap-2">
                <ActionBtn text="Edit" color="yellow" />
                <ActionBtn text="Delete" color="red" />
                <ActionBtn text="Remove Featured" color="indigo" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* Reusable Components */

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold text-gray-800 mt-1">
      {value}
    </h2>
  </div>
);

const ActionBtn = ({ text, color }) => (
  <button
    className={`px-3 py-1 text-xs text-white rounded bg-${color}-500 hover:bg-${color}-600`}
  >
    {text}
  </button>
);

export default Marketplace;
