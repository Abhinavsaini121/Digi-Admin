import React, { useState } from 'react';
import { 
  Search, Eye, Edit, Clock, Power, Trash2, 
  Bell, Image as ImageIcon, 
  Calendar, MapPin, Users, Globe, ExternalLink, Layers
} from 'lucide-react';

const Notify = () => {
  // Changed default active tab to 'notifications' since Plans is removed
  const [activeTab, setActiveTab] = useState('notifications');

  // Navigation Tabs configuration - Removed Shop Plans
  const tabs = [
    { id: 'notifications', label: 'Push Notifications', icon: <Bell size={18} /> },
    { id: 'banners', label: 'Banners', icon: <ImageIcon size={18} /> },
   
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications & CMS</h1>
          <p className="text-slate-500 mt-1">Manage Push Notifications, Banners & Offers</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 
                ${activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
          {/* Shop Plans View is Removed */}
          {activeTab === 'notifications' && <PushNotificationsView />}
          {activeTab === 'banners' && <BannersView />}
        </div>
      </div>
    </div>
  );
};

// --- SECTION 1: PUSH NOTIFICATIONS ---
const PushNotificationsView = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Create Notification Form */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-blue-600" /> Compose Notification
          </h2>
          
          <div className="space-y-4">
            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SelectionCard icon={<Globe size={18}/>} label="Global" active />
                <SelectionCard icon={<MapPin size={18}/>} label="City-based" />
                <SelectionCard icon={<Layers size={18}/>} label="Category" />
                <SelectionCard icon={<Users size={18}/>} label="Specific User" />
              </div>
            </div>

            {/* Conditional Input based on selection (Mock UI) */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select City / Category</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-600">
                    <option>Mumbai, India</option>
                    <option>Delhi, India</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Type</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="flex-1 text-sm py-1.5 bg-white shadow-sm rounded-md font-medium text-slate-800">Instant</button>
                    <button className="flex-1 text-sm py-1.5 text-slate-500">Scheduled</button>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notification Title</label>
              <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg" placeholder="e.g., Diwali Sale is Live!" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message Body</label>
              <textarea className="w-full p-2.5 border border-slate-200 rounded-lg h-24 resize-none" placeholder="Enter your push notification message here..."></textarea>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium w-full flex justify-center items-center gap-2 transition-colors">
              <Bell size={18} /> Send Notification
            </button>
          </div>
        </div>

        {/* Right: Preview or History */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
           <h3 className="font-bold text-slate-700 mb-4">Live Preview</h3>
           <div className="border border-slate-200 bg-white rounded-2xl p-4 shadow-sm max-w-[300px] mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Diwali Sale is Live!</h4>
                  <p className="text-xs text-slate-500 mt-1">Get 50% off on all Pro+ plans today only. Tap to view offers.</p>
                </div>
              </div>
           </div>

           <div className="mt-8">
             <h3 className="font-bold text-slate-700 mb-4">Recent History</h3>
             <div className="space-y-3">
                <HistoryItem title="System Maintenance" time="2 hrs ago" type="Global" status="Sent" />
                <HistoryItem title="New Shop Added" time="1 day ago" type="City: Mumbai" status="Sent" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SECTION 2: BANNERS ---
const BannersView = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ImageIcon className="text-purple-600" /> Banner Management
        </h2>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
          + Add New Banner
        </button>
      </div>

      {/* Upload Area / Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-slate-100 transition-colors cursor-pointer">
           <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
             <ImageIcon className="text-slate-400" />
           </div>
           <p className="font-medium text-slate-700">Upload Banner Image</p>
           <p className="text-xs text-slate-400 mt-1">Rec: 1200x400px (JPG, PNG)</p>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Redirect Link / App Section</label>
             <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm" placeholder="https://example.com/promo or app://sale" />
             </div>
           </div>
           
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Placement</label>
             <select className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white">
               <option>Homepage Carousel</option>
               <option>Shop Details Page</option>
               <option>Checkout Popup</option>
             </select>
           </div>

           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
             <input type="date" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-600" />
           </div>

           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
             <input type="date" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-600" />
           </div>
        </div>
      </div>

      <hr className="border-slate-100 mb-8" />

      {/* Active Banners Grid */}
      <h3 className="font-bold text-slate-700 mb-4">Active Banners</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <BannerCard 
           title="Summer Sale 50%" 
           status="Active" 
           date="Dec 20 - Jan 01" 
           type="Homepage Carousel"
           color="bg-orange-100"
         />
         <BannerCard 
           title="New Pro+ Features" 
           status="Scheduled" 
           date="Jan 05 - Jan 10" 
           type="Redirect Link"
           color="bg-indigo-100"
         />
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SelectionCard = ({ icon, label, active }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
    ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-600'}`}>
    {icon}
    <span className="text-xs font-medium mt-2">{label}</span>
  </div>
);

const HistoryItem = ({ title, time, type, status }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 text-sm">
    <div>
      <p className="font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{type}</p>
    </div>
    <div className="text-right">
      <span className="text-xs font-bold text-green-600 block">{status}</span>
      <span className="text-xs text-slate-400">{time}</span>
    </div>
  </div>
);

const BannerCard = ({ title, status, date, type, color }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all group">
    <div className={`h-32 ${color} w-full flex items-center justify-center relative`}>
      <ImageIcon className="text-black/10 w-16 h-16" />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
        {status}
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-slate-800">{title}</h4>
      <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
        <span>{type}</span>
        <span>{date}</span>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex-1 py-1.5 text-xs font-medium bg-slate-900 text-white rounded">Edit</button>
        <button className="flex-1 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded">Delete</button>
      </div>
    </div>
  </div>
);

export default Notify;