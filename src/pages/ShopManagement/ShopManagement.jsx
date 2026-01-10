import React from "react";
import { useNavigate } from "react-router-dom";

const shops = [
  {
    id: 1,
    name: "Fresh Mart",
    image: "https://dthezntil550i.cloudfront.net/4c/latest/4c1809020315478590002784970/1280_960/58c9e944-af0e-4eca-9eb9-c45b9b2cf62f.png",
    owner: "Rahul Sharma",
    location: "Delhi",
    plan: "Pro+",
    status: "Pending",
  },
  {
    id: 2,
    name: "Daily Needs",
    image: "https://dthezntil550i.cloudfront.net/4c/latest/4c1809020315478590002784970/1280_960/58c9e944-af0e-4eca-9eb9-c45b9b2cf62f.png",
    owner: "Amit Verma",
    location: "Mumbai",
    plan: "Lite",
    status: "Approved",
  },
];

export default function ShopList() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shop Management</h1>

      <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Shop</th>
              <th className="px-5 py-3 text-left font-semibold">Owner</th>
              <th className="px-5 py-3 text-left font-semibold">Location</th>
              <th className="px-5 py-3 text-left font-semibold">Plan</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-center font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr
                key={shop.id}
                className="border-t hover:bg-orange-50 transition"
              >
                <td className="px-5 py-4 flex items-center gap-3">
                  <img src={shop.image} alt="shop" className="w-10 h-10 rounded-lg" />
                  <span className="font-medium text-gray-800">{shop.name}</span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span>{shop.owner}</span>
                    <button
                      onClick={() => navigate(`/owner/${shop.id}`)}
                      className="text-xs text-orange-600 hover:underline w-fit"
                    >
                      View Profile
                    </button>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600">{shop.location}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shop.plan === "Pro+" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {shop.plan}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      shop.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {shop.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => navigate(`/shop/${shop.id}`)}
                    className="px-4 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-xs font-semibold hover:bg-orange-200 transition"
                  >
                    View Shop
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
