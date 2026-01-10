import React from "react";
import { useParams, Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";

export default function ShopDetail() {
  const { id } = useParams();

  // Dummy shop data
  const shop = {
    id,
    // name: "Fresh Mart",
    image:
      "https://dthezntil550i.cloudfront.net/4c/latest/4c1809020315478590002784970/1280_960/58c9e944-af0e-4eca-9eb9-c45b9b2cf62f.png",
    category: "Grocery",
    location: "Delhi",
    owner: {
      id: 101,
      name: "Rahul Sharma",
      image: "https://via.placeholder.com/40",
    },
    plan: "Pro+",
    subscriptionExpiry: "2026-01-31",
    rating: 4.5,
    trustBadge: true,
    shopViews: 1200,
    callCount: 350,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {shop.name} - Shop Details
        </h1>

        <span className="text-sm sm:text-base text-gray-500">
          Shop ID: #{shop.id}
        </span>
      </div>

      {/* Shop Info Card for Mobile */}
      <div className="md:hidden bg-white rounded-xl border border-orange-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4 mb-3">
          <img src={shop.image} alt="shop" className="w-12 h-12 rounded-lg" />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{shop.name}</span>
            <span className="text-gray-500 text-sm">{shop.category}</span>
            <span className="text-gray-500 text-sm">{shop.location}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Owner</span>
            <Link
              to={`/owner/profile/${shop.owner.id}`}
              className="text-sm text-orange-500 hover:underline"
            >
              View Profile
            </Link>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Plan: {shop.plan}</span>
            <span>Expiry: {shop.subscriptionExpiry}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Rating: {shop.rating}</span>
            <span>Trust Badge: {shop.trustBadge ? "✅" : "❌"}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Views: {shop.shopViews}</span>
            <span>Calls: {shop.callCount}</span>
          </div>
        </div>
      </div>

      {/* Shop Info Table for Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-orange-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Shop</th>
              <th className="px-6 py-3 text-left font-semibold">Category</th>
              <th className="px-6 py-3 text-left font-semibold">Location</th>
              <th className="px-6 py-3 text-left font-semibold">Owner</th>
              <th className="px-6 py-3 text-left font-semibold">Plan</th>
              <th className="px-6 py-3 text-left font-semibold">Expiry</th>
              <th className="px-6 py-3 text-left font-semibold">Rating</th>
              <th className="px-6 py-3 text-left font-semibold">Trust Badge</th>
              <th className="px-6 py-3 text-left font-semibold">Views</th>
              <th className="px-6 py-3 text-left font-semibold">Calls</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            <tr className="hover:bg-orange-50 transition">
              <td className="px-6 py-4 flex items-center gap-3">
                <img
                  src={shop.image}
                  alt="shop"
                  className="w-10 h-10 rounded-lg"
                />
                <span className="font-medium text-gray-800">{shop.name}</span>
              </td>
              <td className="px-6 py-4">{shop.category}</td>
              <td className="px-6 py-4">{shop.location}</td>
              <td className="px-6 py-4 flex flex-col gap-1">
                <span className="font-medium">{shop.owner.name}</span>
                <Link
                  to={`/owner/profile/${shop.owner.id}`}
                  className="text-sm text-orange-500 hover:underline"
                >
                  View Profile
                </Link>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                  {shop.plan}
                </span>
              </td>
              <td className="px-6 py-4">{shop.subscriptionExpiry}</td>
              <td className="px-6 py-4">{shop.rating}</td>
              <td className="px-6 py-4">{shop.trustBadge ? "✅" : "❌"}</td>
              <td className="px-6 py-4">{shop.shopViews}</td>
              <td className="px-6 py-4">{shop.callCount}</td>
              <td className="px-6 py-4 text-center">
                <button className="p-2 rounded-lg hover:bg-orange-100 transition">
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
