import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Building2, 
  Edit, 
  Trash2, 
  Activity, 
  Droplet,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const BloodRequest = () => {
  // Mock Data (Linked to Master User Profile)
  const [requests, setRequests] = useState([
    {
      id: 1,
      patientName: "Rahul Sharma",
      bloodGroup: "O+",
      urgency: "Critical",
      hospitalName: "City Care Hospital",
      location: "Pune, Maharashtra",
      contactNumber: "+91 98765 43210",
      status: "Active", // Active, Fulfilled, Deactivated
      createdAt: "2023-10-24"
    },
    {
      id: 2,
      patientName: "Anita Verma",
      bloodGroup: "AB-",
      urgency: "Moderate",
      hospitalName: "Apollo Hospital",
      location: "Mumbai, Maharashtra",
      contactNumber: "+91 99887 76655",
      status: "Fulfilled",
      createdAt: "2023-10-22"
    },
    {
      id: 3,
      patientName: "Suresh Raina",
      bloodGroup: "B+",
      urgency: "Low",
      hospitalName: "General Hospital",
      location: "Delhi, NCR",
      contactNumber: "+91 88776 65544",
      status: "Deactivated",
      createdAt: "2023-10-20"
    }
  ]);

  // Handle Deactivate
  const handleDeactivate = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Deactivated' } : req
    ));
  };

  // Handle Status Change (Cycle through statuses for demo)
  const handleStatusChange = (id, currentStatus) => {
    let newStatus = 'Active';
    if (currentStatus === 'Active') newStatus = 'Fulfilled';
    else if (currentStatus === 'Fulfilled') newStatus = 'Active';
    
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  // Handle Edit (Placeholder)
  const handleEdit = (id) => {
    alert(`Edit functionality for ID: ${id}`);
  };

  // Helper for Urgency Colors
  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': 
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-200"><Activity size={12}/> Active</span>;
      case 'Fulfilled': 
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium border border-blue-200"><CheckCircle size={12}/> Fulfilled</span>;
      case 'Deactivated': 
        return <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium border border-gray-200"><XCircle size={12}/> Inactive</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Blood Requests</h1>
            <p className="text-sm text-gray-500">Manage all your blood donation requests in one place.</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2">
            <Droplet size={18} />
            New Request
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div 
              key={req.id} 
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden relative ${req.status === 'Deactivated' ? 'opacity-75 grayscale-[0.5]' : ''}`}
            >
              
              {/* Top Banner / Blood Group */}
              <div className="relative h-20 bg-gradient-to-r from-red-500 to-red-600 p-4 flex justify-between items-start">
                <div className="bg-white text-red-600 font-bold text-xl h-12 w-12 flex items-center justify-center rounded-full shadow-lg border-2 border-red-100 absolute -bottom-6 left-4 z-10">
                  {req.bloodGroup}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider border ${getUrgencyColor(req.urgency)} bg-white/90`}>
                  {req.urgency}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-8 pb-4 px-4">
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{req.patientName}</h3>
                  {getStatusBadge(req.status)}
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Building2 size={16} className="mt-0.5 text-red-500 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{req.hospitalName}</p>
                      <p className="text-xs text-gray-500">Hospital</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 text-red-500 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{req.location}</p>
                      <p className="text-xs text-gray-500">Location</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Phone size={16} className="mt-0.5 text-red-500 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{req.contactNumber}</p>
                      <p className="text-xs text-gray-500">Contact</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center gap-2">
                
                {/* Status Toggle */}
                {req.status !== 'Deactivated' && (
                   <button 
                   onClick={() => handleStatusChange(req.id, req.status)}
                   className="flex-1 text-xs font-medium py-2 px-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition text-gray-700 flex justify-center items-center gap-1"
                 >
                   <Clock size={14}/>
                   {req.status === 'Active' ? 'Mark Fulfilled' : 'Mark Active'}
                 </button>
                )}

                {/* Edit */}
                <button 
                  onClick={() => handleEdit(req.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Edit Request"
                >
                  <Edit size={18} />
                </button>

                {/* Deactivate */}
                {req.status !== 'Deactivated' && (
                  <button 
                    onClick={() => handleDeactivate(req.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                    title="Deactivate Request"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloodRequest;