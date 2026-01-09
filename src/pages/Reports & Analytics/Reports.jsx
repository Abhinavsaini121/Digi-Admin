import React, { useState } from "react";
import { FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

export default function ReportsAnalytics() {
  const [openExport, setOpenExport] = useState(false);

  const reports = [
    "New users",
    "Job posts",
    "Local needs",
    "Marketplace posts",
    "SOS alerts",
    "Blood requests",
    "Credits purchased",
    "Credits used",
    "Shop subscription revenue",
    "Top categories",
    "Top earning cities",
  ];

  return (
    <div className="p-6 bg-orange-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Daily system performance overview</p>
        </div>

        {/* Export Button */}
        <div className="relative">
          <button
            onClick={() => setOpenExport(!openExport)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-orange-50 text-gray-700 hover:bg-orange-100 transition"
          >
            Export
            <ChevronDown size={16} />
          </button>

          {openExport && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-gray-100 shadow-sm z-10">
              <button className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                <FileText size={16} className="text-red-500" /> PDF
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                <FileSpreadsheet size={16} className="text-green-600" /> Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-sm font-medium text-gray-600">Daily Report</h3>
            <p className="mt-2 text-lg font-semibold text-gray-800">{item}</p>
            <p className="mt-1 text-xs text-gray-400">Updated today</p>
          </div>
        ))}
      </div>
    </div>
  );
}
