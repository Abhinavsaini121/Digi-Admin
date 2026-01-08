import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userActivity, setUserActivity] = useState([]);

  const COLORS = ["#FE702E", "#FFD3B8"];

  const salesData = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 600 },
    { month: "Mar", sales: 800 },
    { month: "Apr", sales: 650 },
    { month: "May", sales: 900 },
    { month: "Jun", sales: 1100 },
  ];

  // 🔥 FETCH ALL USERS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // adjust key if needed

      const res = await fetch(
        "https://test.pearl-developer.com/dryfruits/public/api/get-all-users",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();

      if (!res.ok) {
        console.error("User API Error:", text);
        return;
      }

      const data = JSON.parse(text);

      setTotalUsers(data.total_users);

      const activeUsers = data.users.filter(
        (user) => user.is_active === 1
      ).length;

      const inactiveUsers = data.users.length - activeUsers;

      setUserActivity([
        { name: "Active", value: activeUsers },
        { name: "Inactive", value: inactiveUsers },
      ]);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard Overview
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 bg-white shadow-sm border border-orange-100 rounded-2xl">
          <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
          <p className="text-3xl font-bold mt-2 text-[#FE702E]">
            {totalUsers}
          </p>
        </div>

        <div className="p-5 bg-white shadow-sm border border-orange-100 rounded-2xl">
          <h2 className="text-sm font-medium text-gray-600">Monthly Sales</h2>
          <p className="text-3xl font-bold mt-2 text-orange-600">
            ₹12,340
          </p>
        </div>

        <div className="p-5 bg-white shadow-sm border border-orange-100 rounded-2xl">
          <h2 className="text-sm font-medium text-gray-600">New Orders</h2>
          <p className="text-3xl font-bold mt-2 text-orange-500">320</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 p-6 bg-white border border-orange-100 shadow-sm rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Sales Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFE2D1" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#FE702E"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity Chart */}
        <div className="p-6 bg-white border border-orange-100 shadow-sm rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            User Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userActivity}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {userActivity.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
