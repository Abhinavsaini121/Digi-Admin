import React from "react";

const PartTimeJobs = () => {
  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Part-Time Job Management
          </h1>
          <p className="text-slate-500 text-sm">Manage flexible and short-term job postings</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md shadow-blue-100">
          + Post Gig
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gig Details</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company / User</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pay Range</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2lybHxlbnwwfHwwfHx8MA%3D%3D"
                        alt="job"
                        className="w-12 h-12 rounded-xl object-cover bg-slate-200 ring-2 ring-slate-100"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">Delivery Boy</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase">
                          Part-Time
                        </span>
                        <span className="text-xs text-slate-400 italic font-medium tracking-tight">Evening (4 hrs)</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-slate-700 font-semibold text-sm">Zomato</span>
                    <span className="text-slate-400 text-xs italic font-medium underline decoration-slate-200">Rahul (Manager)</span>
                  </div>
                </td>

                <td className="p-4 text-slate-600 font-medium">
                   Delhi
                </td>

                <td className="p-4">
                   <span className="text-slate-800 font-bold">₹8,000 – ₹12,000</span>
                </td>

                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-700 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    ACTIVE
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap justify-center gap-2 max-w-[180px] ml-auto">
                    <ActionBtn text="Edit" variant="yellow" />
                    <ActionBtn text="Delete" variant="red" />
                    <ActionBtn text="Apps" variant="blue" />
                    <ActionBtn text="Resumes" variant="indigo" />
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
  };

  return (
    <button className={`px-3 py-1.5 text-[11px] font-bold rounded-md border transition-all duration-200 shadow-sm ${styles[variant]}`}>
      {text}
    </button>
  );
};

export default PartTimeJobs;