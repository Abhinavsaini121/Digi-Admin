import React from "react";

const FullTimeJobs = () => {
  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Full-Time Job Management
          </h1>
          <p className="text-slate-500 text-sm">Manage and monitor all permanent job listings</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md shadow-indigo-100">
          + Add New Job
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Details</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary Package</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&auto=format&fit=crop&q=60"
                      alt="job"
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <p className="font-bold text-slate-800 text-base">React Developer</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full uppercase">
                          Full-Time
                        </span>
                        <span className="text-xs text-slate-400">2–4 Years Exp.</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <p className="text-slate-700 font-medium">TechSoft Pvt Ltd</p>
                </td>

                <td className="p-4">
                  <div className="flex items-center text-slate-600">
                    <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Bangalore
                  </div>
                </td>

                <td className="p-4 font-semibold text-slate-700">
                  ₹4 LPA – ₹7 <span className="text-[10px] text-slate-400">LPA</span>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 text-[11px] font-bold bg-amber-100 text-amber-700 rounded-lg">
                    EXPIRED
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap justify-center gap-2 max-w-[200px] ml-auto">
                    <ActionBtn text="Edit" variant="yellow" />
                    <ActionBtn text="Delete" variant="red" />
                    <ActionBtn text="Apps" variant="blue" />
                    <ActionBtn text="Resumes" variant="indigo" />
                    <ActionBtn text="Info" variant="gray" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ text, variant }) => {
  const styles = {
    yellow: "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-amber-200",
    red: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-200",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-200",
    gray: "bg-slate-50 text-slate-600 hover:bg-slate-600 hover:text-white border-slate-200",
  };

  return (
    <button className={`px-3 py-1.5 text-[11px] font-bold rounded-md border transition-all duration-200 shadow-sm ${styles[variant]}`}>
      {text}
    </button>
  );
};

export default FullTimeJobs;