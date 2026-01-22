import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Edit3, 
  Power, 
  MapPin, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X,
  FileText
} from 'lucide-react';

const SOSDashboard = () => {
  // --- State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  // --- Mock Data ---
  const [records, setRecords] = useState([
    {
      id: 'SH-101',
      userId: 'USR-1092',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      startTime: '10:45 AM',
      endTime: 'Ongoing',
      duration: '15m elapsed',
      mode: '--',
      location: 'Sector 18, Noida, UP',
      contacts: ['M', 'B', '+2'],
      status: 'Active',
      plan: 'PRO+', // mapped to theme style
    },
    {
      id: 'SH-102',
      userId: 'USR-2045',
      name: 'Anjali Gupta',
      phone: '+91 88776 55443',
      startTime: '09:10 AM',
      endTime: '09:25 AM',
      duration: '15 min',
      mode: 'Manual Stop',
      location: 'MG Road, Mumbai, MH',
      contacts: ['S'],
      status: 'Resolved',
      plan: 'LITE',
    },
    {
      id: 'SH-103',
      userId: 'USR-3321',
      name: 'Vikram Singh',
      phone: '+91 77665 54433',
      startTime: 'Yesterday',
      endTime: '11:30 PM',
      duration: '30 min',
      mode: 'Auto-Expired',
      location: 'Koramangala, Bangalore',
      contacts: [],
      status: 'Expired',
      plan: 'TRIAL',
    }
  ]);

  // --- Handlers ---

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDeactivate = (name) => {
    // In a real app, this would be an API call
    if (window.confirm(`Are you sure you want to FORCE STOP the SOS for ${name}?`)) {
      alert(`${name}'s SOS has been deactivated.`);
    }
  };

  const handleViewStatus = (id) => {
    alert(`Navigating to detailed log view for ${id}...`);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    alert("Changes saved successfully!");
    closeModal();
  };

  // --- Helper Components for UI Styles ---

  const StatusBadge = ({ status }) => {
    const styles = {
      Active: "bg-green-100 text-green-700 border border-green-200", // Matches "Active" green in image
      Resolved: "bg-orange-100 text-orange-700 border border-orange-200", // Matches "Expired" orange look
      Expired: "bg-red-100 text-red-700 border border-red-200", // Matches "Blocked" red look
    };
    
    // Override for SOS specific naming if needed
    const displayStatus = status === 'Active' ? 'Active SOS' : status;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${styles[status] || styles.Resolved}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-600' : 'bg-current'}`}></div>
        {displayStatus}
      </span>
    );
  };

  const PlanBadge = ({ type }) => {
    // Mimicking the purple/blue badges from the screenshot (PRO+, LITE)
    const styles = {
      'PRO+': "bg-purple-100 text-purple-700",
      'LITE': "bg-blue-100 text-blue-700",
      'TRIAL': "bg-gray-100 text-gray-700",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[type] || 'bg-gray-100'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans text-slate-800">
      
      {/* --- Header Section --- */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SOS Management (Log-Only)</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor plans, expiry, and shop status (SOS Logs)</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition flex items-center gap-2">
          + Export Logs
        </button>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['All', 'Trial', 'Lite', 'Pro+', 'Expired', 'Blocked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              activeTab === tab 
                ? 'bg-[#1e293b] text-white border-[#1e293b]' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- Main Content Card --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-5 border-b border-slate-100">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by Shop ID, Name or Owner..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-100">
                <th className="p-5">Shop Details (User)</th>
                <th className="p-5">Owner Info</th>
                <th className="p-5">Plan Details</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition group">
                  
                  {/* Column 1: Shop/User Details */}
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-blue-600 font-bold text-xs mb-1">{record.id}</span>
                      <span className="text-slate-900 font-bold text-base">{record.name}</span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{record.location}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Owner Info */}
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-slate-700 font-semibold">{record.name}</span>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                         <Phone className="w-3 h-3" />
                         {record.phone}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Plan Details (Time & Mode) */}
                  <td className="p-5">
                    <div className="flex flex-col items-start gap-1">
                      <PlanBadge type={record.plan} />
                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                         <Clock className="w-3 h-3" />
                         {record.startTime}
                      </div>
                    </div>
                  </td>

                  {/* Column 4: Status */}
                  <td className="p-5">
                    <StatusBadge status={record.status} />
                  </td>

                  {/* Column 5: Actions */}
                  <td className="p-5">
                    <div className="flex justify-end items-center gap-2">
                      
                      {/* View Button (Blue) */}
                      <button 
                        onClick={() => handleViewStatus(record.id)}
                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 border border-transparent hover:border-blue-200 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit Button (Yellow/Orange) */}
                      <button 
                        onClick={() => handleEditClick(record)}
                        className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 border border-transparent hover:border-yellow-200 transition"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                       {/* Status/Clock Button (Purple) - From screenshot */}
                       <button 
                        className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 border border-transparent hover:border-purple-200 transition"
                        title="History"
                      >
                        <Clock className="w-4 h-4" />
                      </button>

                      {/* Deactivate/Delete Button (Red) */}
                      <button 
                        onClick={() => handleDeactivate(record.name)}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 border border-transparent hover:border-red-200 transition"
                        title="Deactivate SOS"
                      >
                        {record.status === 'Active' ? <Power className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================== */}
      {/* EDIT MODAL COMPONENT */}
      {/* ========================== */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all scale-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Edit Shop/SOS</h3>
                <p className="text-xs text-slate-500">{selectedRecord.id}</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner Name</label>
                <input 
                  type="text" 
                  defaultValue={selectedRecord.name} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600 focus:outline-none"
                  readOnly 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Update Status</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white">
                  <option>Active</option>
                  <option>Expired</option>
                  <option>Blocked</option>
                  <option>Trial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Notes</label>
                <textarea 
                  rows="3" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Reason for modification..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-2">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 transition"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SOSDashboard;