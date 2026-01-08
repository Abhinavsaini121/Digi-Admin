import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserPlus,
  Activity,
  Download,
  ShoppingBag,
  Briefcase,
  Store,
  AlertCircle,
  Droplets,
  CreditCard,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

/* -------------------- STATIC MOCK DATA -------------------- */
const STATIC_STATS = {
  totalUsers: "12,840",
  newUsersToday: "145",
  activeUsersNow: "42",
  activeUsersToday: "850",
  monthlyActiveUsers: "5,200",
  totalDownloads: "25,000",
  shops: "184",
  partTimeJobs: "56",
  fullTimeJobs: "32",
  marketplaceListings: "412",
  sosAlertsToday: "03",
  bloodRequestsToday: "08",
  creditsSold: "1,250",
  revenue: "84,500",
  newRegistrations: "24",
};

const STATIC_CHART_DATA = [
  { date: "Oct 01", users: 4000 },
  { date: "Oct 05", users: 5500 },
  { date: "Oct 10", users: 4800 },
  { date: "Oct 15", users: 7000 },
  { date: "Oct 20", users: 8500 },
  { date: "Oct 25", users: 7800 },
  { date: "Oct 30", users: 9200 },
];

/* -------------------- STAT CARD COMPONENT -------------------- */
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="group p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-orange-600`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
        +Live
      </span>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl font-bold mt-1 text-gray-800 tracking-tight">
        {value}
      </p>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 mt-8">
    {title}
  </h2>
);

function Dashboard() {
  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* -------------------- HEADER -------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin <span className="text-[#FE702E]">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of platform performance and statistics.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium">
            Static Preview Mode
          </div>
          <div className="px-4 py-2 bg-[#FE702E] text-white rounded-lg text-sm font-medium shadow-lg shadow-orange-200">
            {new Date().toDateString()}
          </div>
        </div>
      </div>

      {/* -------------------- USER ANALYTICS -------------------- */}
      <SectionTitle title="User Analytics" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatCard
          title="Total Users"
          value={STATIC_STATS.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="New Today"
          value={STATIC_STATS.newUsersToday}
          icon={UserPlus}
          color="bg-green-500"
        />
        <StatCard
          title="Active Now"
          value={STATIC_STATS.activeUsersNow}
          icon={Activity}
          color="bg-orange-500"
        />
        <StatCard
          title="Monthly Active"
          value={STATIC_STATS.monthlyActiveUsers}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Downloads"
          value={STATIC_STATS.totalDownloads}
          icon={Download}
          color="bg-indigo-500"
        />
      </div>

      {/* -------------------- BUSINESS & JOBS -------------------- */}
      <SectionTitle title="Business & Marketplace" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Shops (Lite+Pro)"
          value={STATIC_STATS.shops}
          icon={Store}
          color="bg-pink-500"
        />
        <StatCard
          title="Marketplace"
          value={STATIC_STATS.marketplaceListings}
          icon={ShoppingBag}
          color="bg-yellow-500"
        />
        <StatCard
          title="Part-time Jobs"
          value={STATIC_STATS.partTimeJobs}
          icon={Briefcase}
          color="bg-cyan-500"
        />
        <StatCard
          title="Full-time Jobs"
          value={STATIC_STATS.fullTimeJobs}
          icon={Briefcase}
          color="bg-blue-600"
        />
      </div>

      {/* -------------------- FINANCE & COMMUNITY -------------------- */}
      <SectionTitle title="Finance & Community" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${STATIC_STATS.revenue}`}
          icon={IndianRupee}
          color="bg-emerald-500"
        />
        <StatCard
          title="Credits Sold"
          value={STATIC_STATS.creditsSold}
          icon={CreditCard}
          color="bg-orange-600"
        />
        <StatCard
          title="SOS Alerts"
          value={STATIC_STATS.sosAlertsToday}
          icon={AlertCircle}
          color="bg-red-500"
        />
        <StatCard
          title="Blood Requests"
          value={STATIC_STATS.bloodRequestsToday}
          icon={Droplets}
          color="bg-red-600"
        />
      </div>

      {/* -------------------- GRAPH & SUMMARY SECTION -------------------- */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              User Growth Trends
            </h2>
            <select className="text-sm border border-gray-100 bg-gray-50 rounded-md px-2 py-1 outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={STATIC_CHART_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FE702E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FE702E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#FE702E"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Info Panel */}
        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Platform Summary</h2>
            <p className="text-slate-400 text-sm mb-6">
              Overview of daily performance.
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(254,112,46,0.8)]"></div>
                  <span className="text-slate-300">New Registrations</span>
                </div>
                <span className="font-bold text-lg">
                  {STATIC_STATS.newRegistrations}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300">Active Sessions</span>
                </div>
                <span className="font-bold text-lg">
                  {STATIC_STATS.activeUsersToday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-slate-300">Success Rate</span>
                </div>
                <span className="font-bold text-lg text-green-400">98.2%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">
              Growth Update
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              Platform engagement is up by{" "}
              <span className="text-green-400 font-bold">12%</span> this week.
              Keep up the good work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
