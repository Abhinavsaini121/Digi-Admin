import React, { useState } from 'react';
import { 
  CreditCard, History, PlusCircle, MinusCircle, Calendar, Clock, Tag, 
  CheckCircle, XCircle, Eye, Edit3, Trash2, BarChart3, Search, 
  MoreVertical, ShieldAlert, Power, X
} from 'lucide-react';

const Credits = () => {
  const [activeTab, setActiveTab] = useState('plans');
  
  // --- MODAL STATE ---
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });

  // --- MOCK DATA ---
  const [shops, setShops] = useState([
    { id: 'SH-101', name: 'Modern Electronics', owner: 'Rahul Sharma', phone: '+91 98765 43210', plan: 'PRO+', expiry: '2024-12-20', status: 'Active', location: 'Mumbai • Electronics' },
    { id: 'SH-102', name: 'Organic Groceries', owner: 'Anjali Gupta', phone: '+91 88776 55443', plan: 'LITE', expiry: '2024-05-10', status: 'Expired', location: 'Delhi • Grocery' },
    { id: 'SH-103', name: 'Royal Furniture', owner: 'Vikram Singh', phone: '+91 77665 54433', plan: 'TRIAL', expiry: '2024-02-15', status: 'Blocked', location: 'Pune • Furniture' },
  ]);

  const [transactions] = useState([
    { id: 'TRX-991', shop: 'Modern Electronics', type: 'Purchase', amount: 5000, date: '2024-01-15', method: 'Razorpay' },
    { id: 'TRX-992', shop: 'Royal Furniture', type: 'Deduct', amount: 200, date: '2024-01-18', method: 'Manual Adj.' },
    { id: 'TRX-993', shop: 'Organic Groceries', type: 'Usage', amount: 50, date: '2024-01-20', method: 'Auto-Debit' },
  ]);

  const [coupons] = useState([
    { id: 1, code: 'WELCOME50', discount: '50 Credits', validTill: '2024-12-31', limit: 100, used: 45, status: 'Active' },
    { id: 2, code: 'DIWALI24', discount: '20% OFF', validTill: '2024-11-01', limit: 500, used: 500, status: 'Expired' },
  ]);

  // --- ACTIONS (Credits Tab) ---
  const handleManualCredit = (action) => {
    const amount = prompt(`Enter amount to ${action}:`);
    if (amount) alert(`Successfully ${action}ed ${amount} credits.`);
  };

  // --- MODAL HANDLERS (Shop Plans Tab) ---
  const openModal = (type, shopData) => {
    setModalConfig({ isOpen: true, type, data: shopData });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', data: null });
  };

  const handleSaveChanges = () => {
    // API Call logic here
    alert(`Changes saved for ${modalConfig.data?.name}`);
    closeModal();
  };

  // --- HELPER COMPONENTS ---
  const StatusBadge = ({ status }) => {
    const styles = {
      Active: 'bg-green-100 text-green-700',
      Expired: 'bg-amber-100 text-amber-700',
      Blocked: 'bg-red-100 text-red-700',
      Inactive: 'bg-gray-100 text-gray-600',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${styles[status] || styles.Inactive}`}>
        <span className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' : status === 'Expired' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
        {status}
      </span>
    );
  };

  const PlanBadge = ({ plan }) => {
    const styles = {
      'PRO+': 'bg-purple-100 text-purple-700 border-purple-200',
      'LITE': 'bg-blue-100 text-blue-700 border-blue-200',
      'TRIAL': 'bg-gray-200 text-gray-700 border-gray-300',
    };
    return <span className={`px-2 py-0.5 border rounded text-xs font-bold ${styles[plan]}`}>{plan}</span>;
  };

  const ActionBtn = ({ icon: Icon, color, onClick, tooltip }) => (
    <button 
      onClick={onClick} 
      title={tooltip}
      className={`p-2 rounded-lg border hover:bg-gray-50 transition-colors ${color} bg-white border-gray-200`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans text-slate-800 relative">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Manage Credits, Plans, and Coupons</p>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { id: 'plans', label: 'Shop Plans' },
          { id: 'credits', label: 'Credits & Wallet' },
          { id: 'coupons', label: 'Coupons & Offers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- SHOP PLANS TAB (With Modal Actions) --- */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="relative w-96">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Shop ID, Name or Owner..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1 text-xs border rounded-full bg-slate-900 text-white">All</button>
               <button className="px-3 py-1 text-xs border rounded-full text-slate-600 hover:bg-gray-50">Trial</button>
               <button className="px-3 py-1 text-xs border rounded-full text-slate-600 hover:bg-gray-50">Lite</button>
               <button className="px-3 py-1 text-xs border rounded-full text-slate-600 hover:bg-gray-50">Pro+</button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                <th className="p-4">Shop Details</th>
                <th className="p-4">Owner Info</th>
                <th className="p-4">Plan Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <div className="text-xs text-blue-500 font-bold mb-1">{shop.id}</div>
                    <div className="font-bold text-slate-800">{shop.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {shop.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700">{shop.owner}</div>
                    <div className="text-xs text-gray-500 mt-1">{shop.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <PlanBadge plan={shop.plan} />
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                         <Calendar size={10} /> {shop.expiry}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={shop.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <ActionBtn icon={Eye} color="text-blue-500" tooltip="View Details" onClick={() => openModal('view', shop)} />
                      <ActionBtn icon={Edit3} color="text-amber-500" tooltip="Edit Shop" onClick={() => openModal('edit', shop)} />
                      <ActionBtn icon={Clock} color="text-purple-500" tooltip="Expiry Override" onClick={() => openModal('expiry', shop)} />
                      <ActionBtn icon={Power} color="text-green-600" tooltip="Status" onClick={() => openModal('status', shop)} />
                      <ActionBtn icon={Trash2} color="text-red-400" tooltip="Delete" onClick={() => openModal('delete', shop)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CREDITS & WALLET TAB (Restored Full Content) --- */}
      {activeTab === 'credits' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manual Actions Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" /> Manual Actions
              </h3>
              <p className="text-sm text-gray-500 mb-6">Manually add or deduct credits from a specific shop wallet.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleManualCredit('add')}
                  className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-3 rounded-lg font-medium hover:bg-green-100 transition"
                >
                  <PlusCircle size={18} /> Add Credits
                </button>
                <button 
                  onClick={() => handleManualCredit('deduct')}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 py-3 rounded-lg font-medium hover:bg-red-100 transition"
                >
                  <MinusCircle size={18} /> Deduct Credits
                </button>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-1">Total System Credits</h3>
                 <div className="text-3xl font-extrabold mb-2">1,240,500</div>
                 <p className="text-blue-200 text-sm">Across all active shops</p>
               </div>
               <div className="absolute -right-6 -bottom-6 opacity-20 text-white">
                 <BarChart3 size={120} />
               </div>
            </div>
          </div>

          {/* History Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <History size={18} className="text-gray-500" /> Transaction History
              </h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="p-3 font-medium">Transaction ID</th>
                  <th className="p-3 font-medium">Shop</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium text-right">Credits</th>
                  <th className="p-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-500 text-xs">{t.id}</td>
                    <td className="p-3 font-medium text-slate-800">{t.shop}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        t.type === 'Purchase' ? 'bg-green-100 text-green-700' :
                        t.type === 'Deduct' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.type}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5">{t.method}</div>
                    </td>
                    <td className={`p-3 text-right font-bold ${t.type === 'Purchase' ? 'text-green-600' : 'text-slate-700'}`}>
                      {t.type === 'Purchase' ? '+' : '-'}{t.amount}
                    </td>
                    <td className="p-3 text-right text-gray-500 text-xs">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- COUPONS & OFFERS TAB (Restored Full Content) --- */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-slate-800">Coupons & Offers</h3>
               <p className="text-sm text-gray-400">Manage discount codes and user restrictions</p>
             </div>
             <button onClick={() => alert('Open Create Form')} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
               <PlusCircle size={16} /> Create Coupon
             </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount / Credits</th>
                <th className="p-4">Usage Limit</th>
                <th className="p-4">Validity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-800 bg-gray-100 px-2 py-1 rounded w-fit border border-gray-200 border-dashed">
                      <Tag size={14} className="text-orange-500" />
                      {c.code}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{c.discount}</td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">{c.used} / {c.limit}</div>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(c.used / c.limit) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{c.validTill}</td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                       <ActionBtn icon={BarChart3} color="text-blue-500" tooltip="Track Usage" onClick={() => alert('Tracking Usage Stats...')} />
                       <ActionBtn icon={c.status === 'Active' ?  XCircle : CheckCircle} color={c.status === 'Active' ? 'text-red-500' : 'text-green-500'} tooltip={c.status === 'Active' ? 'Disable' : 'Enable'} onClick={() => alert('Toggled Status')} />
                       <ActionBtn icon={Trash2} color="text-gray-400" tooltip="Delete" onClick={() => alert('Delete Coupon')} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL IMPLEMENTATION ================= */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-[450px] transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 pb-0">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {modalConfig.type === 'edit' && 'Edit Shop/SOS'}
                  {modalConfig.type === 'expiry' && 'Override Expiry'}
                  {modalConfig.type === 'status' && 'Update Status'}
                  {modalConfig.type === 'delete' && 'Delete Shop'}
                  {modalConfig.type === 'view' && 'Shop Details'}
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-1">{modalConfig.data?.id}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* --- EDIT / SOS MODE --- */}
              {modalConfig.type === 'edit' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Owner Name</label>
                    <input 
                      type="text" 
                      defaultValue={modalConfig.data?.owner} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Update Status</label>
                    <select 
                      defaultValue={modalConfig.data?.status}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Admin Notes</label>
                    <textarea 
                      placeholder="Reason for modification..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition h-24 resize-none"
                    ></textarea>
                  </div>
                </>
              )}

              {/* --- OTHER MODES --- */}
              {modalConfig.type === 'expiry' && (
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Expiry Date</label>
                   <input type="date" defaultValue={modalConfig.data?.expiry} className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                </div>
              )}

              {modalConfig.type === 'delete' && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                  <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                  <p>Are you sure you want to delete <b>{modalConfig.data?.name}</b>? This action cannot be undone.</p>
                </div>
              )}
              
               {modalConfig.type === 'view' && (
                <div className="text-sm text-gray-600 space-y-2">
                  <p><b>Plan:</b> {modalConfig.data?.plan}</p>
                  <p><b>Phone:</b> {modalConfig.data?.phone}</p>
                  <p><b>Location:</b> {modalConfig.data?.location}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg shadow-md transition ${
                  modalConfig.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {modalConfig.type === 'delete' ? 'Delete Permanently' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Credits;