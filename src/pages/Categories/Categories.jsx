

// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Layers, GitMerge, Edit3, Trash2, PlusCircle, 
// //   Search, Power, X, Move, GripVertical, CheckCircle, ShieldAlert
// // } from 'lucide-react';
// // import { addCategory } from "../../auth/adminLogin";

// // // Component: Simple Toast Simulation
// // const Toast = ({ message, type, onClose }) => {
// //     const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
// //     return (
// //         <div className={`fixed bottom-5 right-5 ${color} text-white p-4 rounded-lg shadow-xl z-[9999] transition-opacity duration-300 animate-in fade-in slide-in-from-right-4`}>
// //             <div className="flex items-center gap-2">
// //                 {type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
// //                 <span className="font-semibold text-sm">{message}</span>
// //             </div>
// //             <button onClick={onClose} className="absolute top-1 right-1 text-white/80 hover:text-white">
// //                 <X size={16} />
// //             </button>
// //         </div>
// //     );
// // };


// // const Categories = () => {
// //   const [activeTab, setActiveTab] = useState('local'); // 'local' | 'marketplace' | 'shops'
// //   const [categoryNameState, setCategoryNameState] = useState('');
// //   const [imageFileState, setImageFileState] = useState(null);
  
// //   // --- MOCK DATA ---
// //   const [localData, setLocalData] = useState([
// //     { id: 'CAT-101', name: 'Home Services', subs: ['Plumber', 'Electrician', 'Carpenter'], status: 'Active' },
// //     { id: 'CAT-102', name: 'Health & Wellness', subs: ['Yoga', 'Gym', 'Physiotherapy'], status: 'Active' },
// //     { id: 'CAT-103', name: 'Event Planning', subs: ['Decorators', 'Catering'], status: 'Disabled' },
// //   ]);

// //   const [marketData, setMarketData] = useState([
// //     { id: 'MKT-201', name: 'Electronics', subs: [], status: 'Active' }, // Marketplace has no subs
// //     { id: 'MKT-202', name: 'Vehicles', subs: [], status: 'Active' },
// //     { id: 'MKT-203', name: 'Real Estate', subs: [], status: 'Disabled' },
// //   ]);

// //   const [shopData, setShopData] = useState([
// //     { id: 'SHP-301', name: 'Fashion', subs: ['Men', 'Women', 'Kids'], status: 'Active' },
// //     { id: 'SHP-302', name: 'Electronics', subs: ['Mobiles', 'Laptops'], status: 'Active' },
// //   ]);

// //   // --- MODAL & TOAST STATE ---
// //   const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
// //   const [toastConfig, setToastConfig] = useState({ message: '', type: '', show: false });


// //   // --- HELPERS ---
// //   const getCurrentData = () => {
// //     if (activeTab === 'local') return localData;
// //     if (activeTab === 'marketplace') return marketData;
// //     return shopData;
// //   };

// //   const getTabLabel = () => {
// //     if (activeTab === 'local') return 'Local Needs';
// //     if (activeTab === 'marketplace') return 'Marketplace';
// //     return 'Shops';
// //   };

// //   // --- MODAL HANDLERS ---
// //   const openModal = (type, data = null) => {
// //     // Reset states when opening 'add' modal
// //     if (type === 'add') {
// //         setCategoryNameState('');
// //         setImageFileState(null);
// //     }
// //     setModalConfig({ isOpen: true, type, data });
// //   };

// //   const closeModal = () => {
// //     setModalConfig({ isOpen: false, type: '', data: null });
// //   };

// //   // --- API / SAVE HANDLER (UPDATED) ---
// //   const handleSaveChanges = async () => {
    
// //     // --- ADD CATEGORY LOGIC ---
// //     if (modalConfig.type === 'add') {
// //         // Simple Validation
// //         if (!categoryNameState.trim()) {
// //             setToastConfig({ message: "Category Name is required.", type: 'error', show: true });
// //             return;
// //         }
// //         if (!imageFileState) {
// //             setToastConfig({ message: "Category Image is required.", type: 'error', show: true });
// //             return;
// //         }

// //         try {
// //             const formData = new FormData();
// //             formData.append('name', categoryNameState); 
// //             formData.append('image', imageFileState);   

// //             // Assuming addCategory is available and works as expected
// //             await addCategory(formData); 
            
// //             // Success Toast
// //             setToastConfig({ message: "Category added successfully!", type: 'success', show: true });

// //             // Clear States & Close Modal
// //             setCategoryNameState('');
// //             setImageFileState(null);
// //             closeModal();
            
// //             // Note: Yahan list refresh karne ka logic aayega (e.g., fetchCategories())
        
// //         } catch (err) {
// //             // Error Toast
// //             setToastConfig({ message: `Error adding category: ${err.message}`, type: 'error', show: true });
// //         }
        
// //     } 
    
// //     // --- PLACEHOLDER LOGIC FOR OTHER MODAL TYPES ---
// //     else {
// //         // Placeholder for edit, delete, status, reorder save actions
// //         console.log(`Handling Save Changes for: ${modalConfig.type}`);
// //         closeModal();
// //         // Optional: Add a success toast for other simulated actions
// //         setToastConfig({ message: `${getTabLabel()} ${modalConfig.type} updated successfully (Simulated).`, type: 'success', show: true });
// //     }
// // };

// //   // --- COMPONENT: Action Button (unchanged) ---
// //   const ActionBtn = ({ icon: Icon, color, onClick, tooltip }) => (
// //     // ... (ActionBtn code remains the same)
// //     <button 
// //       onClick={onClick} 
// //       title={tooltip}
// //       className={`p-2 rounded-lg border hover:bg-gray-50 transition-colors ${color} bg-white border-gray-200`}
// //     >
// //       <Icon size={16} />
// //     </button>
// //   );

// //   // --- COMPONENT: Status Badge (unchanged) ---
// //   const StatusBadge = ({ status }) => (
// //     // ... (StatusBadge code remains the same)
// //     <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
// //       status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
// //     }`}>
// //       <span className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
// //       {status}
// //     </span>
// //   );

// //   return (
// //     <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans text-slate-800 relative">
      
// //       {/* HEADER (unchanged) */}
// //       <div className="mb-8">
// //         <h1 className="text-2xl font-bold text-slate-900">Categories & Master Data</h1>
// //         <p className="text-slate-500 text-sm">Manage Main Categories, Sub-categories and Ordering</p>
// //       </div>

// //       {/* TABS (unchanged) */}
// //       {/* ... (Tabs code remains the same) ... */}
// //       <div className="flex flex-wrap gap-3 mb-6">
// //         {[
// //           { id: 'local', label: 'Local Needs' },
// //           { id: 'marketplace', label: 'Marketplace' },
// //           { id: 'shops', label: 'Shops' }
// //         ].map((tab) => (
// //           <button
// //             key={tab.id}
// //             onClick={() => setActiveTab(tab.id)}
// //             className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
// //               activeTab === tab.id 
// //                 ? 'bg-slate-900 text-white shadow-md' 
// //                 : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
// //             }`}
// //           >
// //             {tab.label}
// //           </button>
// //         ))}
// //       </div>

// //       {/* --- MAIN CONTENT CARD (unchanged) --- */}
// //       {/* ... (Main content table remains the same) ... */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
// //         {/* Card Header (Search + Add/Reorder Actions) */}
// //         <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
// //           <div className="relative w-80">
// //             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
// //             <input 
// //               type="text" 
// //               placeholder={`Search ${getTabLabel()}...`}
// //               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
// //             />
// //           </div>
// //           <div className="flex gap-2">
// //              <button 
// //                 onClick={() => openModal('reorder', getCurrentData())}
// //                 className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-50 font-medium"
// //              >
// //                 <Move size={16} /> Reorder List
// //              </button>
// //              <button 
// //                 onClick={() => openModal('add')}
// //                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
// //              >
// //                <PlusCircle size={16} /> Add Category
// //              </button>
// //           </div>
// //         </div>

// //         {/* Table */}
// //         <table className="w-full text-left border-collapse">
// //           <thead>
// //             <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100 bg-gray-50/50">
// //               <th className="p-4 w-24">ID</th>
// //               <th className="p-4">Main Category</th>
// //               {activeTab !== 'marketplace' && <th className="p-4">Sub-categories</th>}
// //               <th className="p-4">Status</th>
// //               <th className="p-4 text-right">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {getCurrentData().map((item) => (
// //               <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
// //                 <td className="p-4 text-xs font-mono text-gray-400">{item.id}</td>
// //                 <td className="p-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
// //                       <Layers size={18} />
// //                     </div>
// //                     <span className="font-bold text-slate-800">{item.name}</span>
// //                   </div>
// //                 </td>
                
// //                 {/* Conditionally Render Sub-categories */}
// //                 {activeTab !== 'marketplace' && (
// //                   <td className="p-4">
// //                     <div className="flex flex-wrap gap-1">
// //                       {item.subs.map((sub, idx) => (
// //                         <span key={idx} className="text-xs px-2 py-1 bg-gray-100 border border-gray-200 text-slate-600 rounded-md">
// //                           {sub}
// //                         </span>
// //                       ))}
// //                       {item.subs.length === 0 && <span className="text-xs text-gray-400 italic">No sub-categories</span>}
// //                     </div>
// //                   </td>
// //                 )}

// //                 <td className="p-4">
// //                   <StatusBadge status={item.status} />
// //                 </td>
                
// //                 <td className="p-4">
// //                   <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
// //                     <ActionBtn icon={Edit3} color="text-amber-500" tooltip="Edit" onClick={() => openModal('edit', item)} />
// //                     <ActionBtn icon={Power} color={item.status === 'Active' ? 'text-green-600' : 'text-gray-400'} tooltip="Enable/Disable" onClick={() => openModal('status', item)} />
// //                     <ActionBtn icon={Trash2} color="text-red-400" tooltip="Delete" onClick={() => openModal('delete', item)} />
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>


// //       {/* ================= MODAL IMPLEMENTATION ================= */}
// //       {modalConfig.isOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
// //           <div className="bg-white rounded-2xl shadow-2xl w-[500px] transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            
// //             {/* Modal Header (unchanged) */}
// //             <div className="flex justify-between items-start p-6 pb-0">
// //               <div>
// //                 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
// //                   {modalConfig.type === 'add' && <><PlusCircle className="text-blue-500" size={20}/> Add New Category</>}
// //                   {modalConfig.type === 'edit' && <><Edit3 className="text-amber-500" size={20}/> Edit Category</>}
// //                   {modalConfig.type === 'reorder' && <><Move className="text-slate-500" size={20}/> Reorder Categories</>}
// //                   {modalConfig.type === 'delete' && <><ShieldAlert className="text-red-500" size={20}/> Delete Category</>}
// //                   {modalConfig.type === 'status' && <><Power className="text-green-500" size={20}/> Update Status</>}
// //                 </h2>
// //                 <p className="text-xs text-gray-500 mt-1 ml-7">
// //                   {getTabLabel()} Section
// //                 </p>
// //               </div>
// //               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             {/* Modal Body (UPDATED) */}
// //             <div className="p-6 space-y-4">
              
// //               {/* --- ADD / EDIT FORM (UPDATED) --- */}
// //               {(modalConfig.type === 'add' || modalConfig.type === 'edit') && (
// //                 <>
// //                   <div>
// //                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category Name (Main)</label>
// //                     <input 
// //                       type="text" 
// //                       // 'add' mode uses controlled state
// //                       value={modalConfig.type === 'add' ? categoryNameState : undefined}
// //                       onChange={(e) => modalConfig.type === 'add' && setCategoryNameState(e.target.value)}
// //                       // 'edit' mode uses defaultValue (for simplicity)
// //                       defaultValue={modalConfig.type === 'edit' ? modalConfig.data?.name || '' : undefined}
// //                       placeholder="e.g. Home Services"
// //                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
// //                     />
// //                   </div>

// //                   {/* New: Category Image Input */}
// //                   {modalConfig.type === 'add' && (
// //                       <div>
// //                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category Image</label>
// //                           <input
// //                               type="file"
// //                               accept="image/*"
// //                               onChange={(e) => setImageFileState(e.target.files[0])}
// //                               className="w-full text-sm text-slate-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out"
// //                           />
// //                           {imageFileState && (
// //                               <p className="text-[10px] text-gray-400 mt-1">Selected: {imageFileState.name}</p>
// //                           )}
// //                       </div>
// //                   )}


// //                   <div className="flex items-center gap-2 mt-2">
// //                     <input type="checkbox" id="activeStatus" defaultChecked={modalConfig.data?.status === 'Active' || true} className="rounded text-blue-600 focus:ring-blue-500" />
// //                     <label htmlFor="activeStatus" className="text-sm text-slate-700 font-medium">Enable Immediately</label>
// //                   </div>
// //                 </>
// //               )}

// //               {/* --- REORDER LIST UI (unchanged) --- */}
// //               {modalConfig.type === 'reorder' && (
// //                 <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
// //                    <p className="text-sm text-gray-500 mb-3">Drag items to reorder (Simulation)</p>
// //                    {(modalConfig.data || []).map((item, idx) => (
// //                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-gray-100 transition">
// //                         <span className="text-gray-400 font-mono text-xs">{idx + 1}</span>
// //                         <GripVertical size={16} className="text-gray-400" />
// //                         <span className="font-medium text-slate-700 text-sm flex-1">{item.name}</span>
// //                         <div className="text-xs text-gray-400 px-2 bg-white rounded border border-gray-200">{item.id}</div>
// //                      </div>
// //                    ))}
// //                 </div>
// //               )}

// //               {/* --- DELETE CONFIRMATION (unchanged) --- */}
// //               {modalConfig.type === 'delete' && (
// //                 <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-100">
// //                   <p>Are you sure you want to delete <b>{modalConfig.data?.name}</b>?</p>
// //                   <p className="mt-2 text-xs opacity-80">This will also delete {modalConfig.data?.subs?.length || 0} sub-categories associated with it.</p>
// //                 </div>
// //               )}

// //               {/* --- STATUS TOGGLE (unchanged) --- */}
// //               {modalConfig.type === 'status' && (
// //                 <div className="text-center py-4">
// //                   <p className="text-slate-700 mb-4">
// //                     Current Status: <b>{modalConfig.data?.status}</b>
// //                   </p>
// //                   <p className="text-sm text-gray-500">
// //                     Do you want to {modalConfig.data?.status === 'Active' ? 'Disable' : 'Enable'} this category?
// //                   </p>
// //                 </div>
// //               )}

// //             </div>

// //             {/* Modal Footer (unchanged) */}
// //             <div className="p-6 pt-0 flex gap-3">
// //               <button 
// //                 onClick={closeModal}
// //                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition"
// //               >
// //                 Cancel
// //               </button>
// //               <button 
// //                 onClick={handleSaveChanges}
// //                 className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg shadow-md transition ${
// //                   modalConfig.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
// //                 }`}
// //               >
// //                 {modalConfig.type === 'delete' ? 'Delete' : 'Save Changes'}
// //               </button>
// //             </div>

// //           </div>
// //         </div>
// //       )}

// //       {/* ================= TOAST RENDERER ================= */}
// //       {toastConfig.show && (
// //         <Toast 
// //             message={toastConfig.message} 
// //             type={toastConfig.type} 
// //             onClose={() => setToastConfig({ ...toastConfig, show: false })} 
// //         />
// //       )}

// //     </div>
// //   );
// // };

// // export default Categories;

// import React, { useState, useEffect } from 'react';
// import { 
//   Layers, GitMerge, Edit3, Trash2, PlusCircle, 
//   Search, Power, X, Move, GripVertical, CheckCircle, ShieldAlert
// } from 'lucide-react';
// // Import new and existing API functions
// import { addCategory, getAllCategories } from "../../auth/adminLogin"; // Assuming both are here

// // Component: Simple Toast Simulation
// const Toast = ({ message, type, onClose }) => {
//     const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
//     return (
//         <div className={`fixed bottom-5 right-5 ${color} text-white p-4 rounded-lg shadow-xl z-[9999] transition-opacity duration-300 animate-in fade-in slide-in-from-right-4`}>
//             <div className="flex items-center gap-2">
//                 {type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
//                 <span className="font-semibold text-sm">{message}</span>
//             </div>
//             <button onClick={onClose} className="absolute top-1 right-1 text-white/80 hover:text-white">
//                 <X size={16} />
//             </button>
//         </div>
//     );
// };

// // Component to display image and name
// const ImageCell = ({ name, imageUrl }) => (
//     <div className="flex items-center gap-3">
//         {imageUrl ? (
//             <img 
//                 src={imageUrl} 
//                 alt={name} 
//                 className="w-10 h-10 object-cover rounded-md border border-gray-200"
//             />
//         ) : (
//             <div className="w-10 h-10 bg-gray-100 text-gray-400 flex items-center justify-center rounded-md">
//                 <Layers size={18} />
//             </div>
//         )}
//         <span className="font-bold text-slate-800">{name}</span>
//     </div>
// );


// const Categories = () => {
//   const [activeTab, setActiveTab] = useState('local'); // 'local' | 'marketplace' | 'shops'
//   const [categoryNameState, setCategoryNameState] = useState('');
//   const [imageFileState, setImageFileState] = useState(null);
  
//   // --- NEW STATE FOR API DATA ---
//   const [categoriesData, setCategoriesData] = useState([]); // Holds API data
//   const [isLoading, setIsLoading] = useState(true);

//   // --- MOCK DATA (COMMENTED/REMOVED FOR API USE) ---
//   // const [localData, setLocalData] = useState([...]);
//   // const [marketData, setMarketData] = useState([...]);
//   // const [shopData, setShopData] = useState([...]);


//   // --- MODAL & TOAST STATE ---
//   const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
//   const [toastConfig, setToastConfig] = useState({ message: '', type: '', show: false });

//   // --- DATA FETCHING EFFECT ---
//   const fetchCategories = async () => {
//     setIsLoading(true);
//     try {
//         const data = await getAllCategories();
//         // Since API gives a flat list, we'll use it for the 'local' tab for now
//         setCategoriesData(data); 
//         // For multi-tab view, you might need logic to filter data here (e.g. data.filter(c => c.type === activeTab))
        
//         // Simulating setting localData for current activeTab (if needed)
//         // setLocalData(data); 
//     } catch (err) {
//         setToastConfig({ message: `Failed to fetch categories: ${err.message || 'Error'}`, type: 'error', show: true });
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [/* activeTab */]); // Re-fetch on tab change if data is tab-specific

//   // --- HELPERS ---
//   const getCurrentData = () => {
//     // Now return API data for demonstration
//     // Note: In a real app, you'd filter categoriesData based on activeTab
//     return categoriesData.map(item => ({
//         id: item._id,
//         name: item.name,
//         image: item.image,
//         status: item.status ? 'Active' : 'Disabled', // Convert boolean status to string
//         createdAt: new Date(item.createdAt).toLocaleDateString(),
//         // Mock sub-categories for displaying in the table structure (since API lacks it)
//         subs: ['Sub 1', 'Sub 2'], 
//     }));
//   };

//   const getTabLabel = () => {
//     if (activeTab === 'local') return 'Local Needs';
//     if (activeTab === 'marketplace') return 'Marketplace';
//     return 'Shops';
//   };

//   // --- MODAL HANDLERS ---
//   const openModal = (type, data = null) => {
//     if (type === 'add') {
//         setCategoryNameState('');
//         setImageFileState(null);
//     }
//     setModalConfig({ isOpen: true, type, data });
//   };

//   const closeModal = () => {
//     setModalConfig({ isOpen: false, type: '', data: null });
//   };

//   // --- API / SAVE HANDLER ---
//   const handleSaveChanges = async () => {
    
//     // --- ADD CATEGORY LOGIC ---
//     if (modalConfig.type === 'add') {
//         if (!categoryNameState.trim() || !imageFileState) {
//             setToastConfig({ message: "Name and Image are required.", type: 'error', show: true });
//             return;
//         }

//         try {
//             const formData = new FormData();
//             formData.append('name', categoryNameState); 
//             formData.append('image', imageFileState);   

//             await addCategory(formData); 
            
//             setToastConfig({ message: "Category added successfully!", type: 'success', show: true });

//             setCategoryNameState('');
//             setImageFileState(null);
//             closeModal();
//             fetchCategories(); // Refresh list after successful addition
        
//         } catch (err) {
//             setToastConfig({ message: `Error adding category: ${err.message || 'API Error'}`, type: 'error', show: true });
//         }
        
//     } else {
//         // Placeholder for edit, delete, status, reorder save actions
//         console.log(`Handling Save Changes for: ${modalConfig.type}`);
//         closeModal();
//         setToastConfig({ message: `${getTabLabel()} ${modalConfig.type} updated successfully (Simulated).`, type: 'success', show: true });
//     }
// };

//   // --- COMPONENT: Action Button (unchanged) ---
//   const ActionBtn = ({ icon: Icon, color, onClick, tooltip }) => (
//     <button 
//       onClick={onClick} 
//       title={tooltip}
//       className={`p-2 rounded-lg border hover:bg-gray-50 transition-colors ${color} bg-white border-gray-200`}
//     >
//       <Icon size={16} />
//     </button>
//   );

//   // --- COMPONENT: Status Badge (updated to handle boolean/string status) ---
//   const StatusBadge = ({ status }) => {
//     const isActive = status === 'Active' || status === true;
//     const label = isActive ? 'Active' : 'Disabled';
//     return (
//         <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
//           isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
//         }`}>
//           <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
//           {label}
//         </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans text-slate-800 relative">
      
//       {/* HEADER (unchanged) */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-slate-900">Categories & Master Data</h1>
//         <p className="text-slate-500 text-sm">Manage Main Categories, Sub-categories and Ordering</p>
//       </div>

//       {/* TABS (unchanged) */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         {[
//           { id: 'local', label: 'Local Needs' },
//           { id: 'marketplace', label: 'Marketplace' },
//           { id: 'shops', label: 'Shops' }
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//               activeTab === tab.id 
//                 ? 'bg-slate-900 text-white shadow-md' 
//                 : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* --- MAIN CONTENT CARD --- */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
//         {/* Card Header (unchanged) */}
//         <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
//           <div className="relative w-80">
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder={`Search ${getTabLabel()}...`}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
//             />
//           </div>
//           <div className="flex gap-2">
//              <button 
//                 onClick={() => openModal('reorder', getCurrentData())}
//                 className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-50 font-medium"
//              >
//                 <Move size={16} /> Reorder List
//              </button>
//              <button 
//                 onClick={() => openModal('add')}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
//              >
//                <PlusCircle size={16} /> Add Category
//              </button>
//           </div>
//         </div>

//         {/* Table (UPDATED to use API data structure) */}
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100 bg-gray-50/50">
//               <th className="p-4 w-24">ID</th>
//               <th className="p-4">Main Category</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Created At</th>
//               <th className="p-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//                 <tr>
//                     <td colSpan={5} className="p-4 text-center text-gray-500">Loading categories...</td>
//                 </tr>
//             ) : getCurrentData().length === 0 ? (
//                  <tr>
//                     <td colSpan={5} className="p-4 text-center text-gray-500">No categories found.</td>
//                 </tr>
//             ) : (
//               getCurrentData().map((item) => (
//                 <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
//                   <td className="p-4 text-xs font-mono text-gray-400">{item.id}</td>
//                   <td className="p-4">
//                     <ImageCell name={item.name} imageUrl={item.image} />
//                   </td>
//                   <td className="p-4">
//                     <StatusBadge status={item.status} />
//                   </td>
//                   <td className="p-4 text-sm text-gray-600">{item.createdAt}</td> {/* Display Created At */}
//                   <td className="p-4">
// <div className="flex justify-end gap-2 transition-opacity">
//                       <ActionBtn icon={Edit3} color="text-amber-500" tooltip="Edit" onClick={() => openModal('edit', item)} />
//                       <ActionBtn icon={Power} color={item.status === 'Active' ? 'text-green-600' : 'text-gray-400'} tooltip="Enable/Disable" onClick={() => openModal('status', item)} />
//                       <ActionBtn icon={Trash2} color="text-red-400" tooltip="Delete" onClick={() => openModal('delete', item)} />
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>


//       {/* ================= MODAL IMPLEMENTATION (unchanged logic, only Sub-categories input removed for 'add' mode) ================= */}
//       {modalConfig.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
//           <div className="bg-white rounded-2xl shadow-2xl w-[500px] transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            
//             {/* Modal Header */}
//             <div className="flex justify-between items-start p-6 pb-0">
//               <div>
//                 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//                   {modalConfig.type === 'add' && <><PlusCircle className="text-blue-500" size={20}/> Add New Category</>}
//                   {modalConfig.type === 'edit' && <><Edit3 className="text-amber-500" size={20}/> Edit Category</>}
//                   {modalConfig.type === 'reorder' && <><Move className="text-slate-500" size={20}/> Reorder Categories</>}
//                   {modalConfig.type === 'delete' && <><ShieldAlert className="text-red-500" size={20}/> Delete Category</>}
//                   {modalConfig.type === 'status' && <><Power className="text-green-500" size={20}/> Update Status</>}
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-1 ml-7">
//                   {getTabLabel()} Section
//                 </p>
//               </div>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 space-y-4">
              
//               {/* --- ADD / EDIT FORM --- */}
//               {(modalConfig.type === 'add' || modalConfig.type === 'edit') && (
//                 <>
//                   <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category Name (Main)</label>
//                     <input 
//                       type="text" 
//                       value={modalConfig.type === 'add' ? categoryNameState : undefined}
//                       onChange={(e) => modalConfig.type === 'add' && setCategoryNameState(e.target.value)}
//                       defaultValue={modalConfig.type === 'edit' ? modalConfig.data?.name || '' : undefined}
//                       placeholder="e.g. Home Services"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
//                     />
//                   </div>

//                   {/* Category Image Input */}
//                   {modalConfig.type === 'add' && (
//                       <div>
//                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category Image</label>
//                           <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => setImageFileState(e.target.files[0])}
//                               className="w-full text-sm text-slate-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out"
//                           />
//                           {imageFileState && (
//                               <p className="text-[10px] text-gray-400 mt-1">Selected: {imageFileState.name}</p>
//                           )}
//                       </div>
//                   )}

//                   {/* Sub-categories (Now hidden for all, as API data doesn't support it directly) */}
//                   {/* You can re-add this input field and the conditional rendering logic in the table 
//                       if your categories need to manage sub-categories without API support or if you plan to update the API later. 
//                       For now, I'm removing the input field from the modal to align with the flat API structure provided.
//                   */}
                  
//                   <div className="flex items-center gap-2 mt-2">
//                     <input type="checkbox" id="activeStatus" defaultChecked={modalConfig.data?.status === 'Active' || true} className="rounded text-blue-600 focus:ring-blue-500" />
//                     <label htmlFor="activeStatus" className="text-sm text-slate-700 font-medium">Enable Immediately</label>
//                   </div>
//                 </>
//               )}

//               {/* --- REORDER LIST UI (unchanged) --- */}
//               {modalConfig.type === 'reorder' && (
//                 <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
//                    <p className="text-sm text-gray-500 mb-3">Drag items to reorder (Simulation)</p>
//                    {(modalConfig.data || []).map((item, idx) => (
//                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-gray-100 transition">
//                         <span className="text-gray-400 font-mono text-xs">{idx + 1}</span>
//                         <GripVertical size={16} className="text-gray-400" />
//                         <span className="font-medium text-slate-700 text-sm flex-1">{item.name}</span>
//                         <div className="text-xs text-gray-400 px-2 bg-white rounded border border-gray-200">{item.id}</div>
//                      </div>
//                    ))}
//                 </div>
//               )}

//               {/* --- DELETE CONFIRMATION (unchanged) --- */}
//               {modalConfig.type === 'delete' && (
//                 <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-100">
//                   <p>Are you sure you want to delete <b>{modalConfig.data?.name}</b>?</p>
//                   <p className="mt-2 text-xs opacity-80">This will also delete {modalConfig.data?.subs?.length || 0} sub-categories associated with it.</p>
//                 </div>
//               )}

//               {/* --- STATUS TOGGLE (unchanged) --- */}
//               {modalConfig.type === 'status' && (
//                 <div className="text-center py-4">
//                   <p className="text-slate-700 mb-4">
//                     Current Status: <b>{modalConfig.data?.status}</b>
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Do you want to {modalConfig.data?.status === 'Active' ? 'Disable' : 'Enable'} this category?
//                   </p>
//                 </div>
//               )}

//             </div>

//             {/* Modal Footer (unchanged) */}
//             <div className="p-6 pt-0 flex gap-3">
//               <button 
//                 onClick={closeModal}
//                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSaveChanges}
//                 className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg shadow-md transition ${
//                   modalConfig.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {modalConfig.type === 'delete' ? 'Delete' : 'Save Changes'}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* ================= TOAST RENDERER ================= */}
//       {toastConfig.show && (
//         <Toast 
//             message={toastConfig.message} 
//             type={toastConfig.type} 
//             onClose={() => setToastConfig({ ...toastConfig, show: false })} 
//         />
//       )}

//     </div>
//   );
// };

// export default Categories;

import React, { useState, useEffect } from 'react';
import { 
  Layers, GitMerge, Edit3, Trash2, PlusCircle, 
  Search, Power, X, Move, GripVertical, CheckCircle, ShieldAlert
} from 'lucide-react';
// Import new and existing API functions
import { addCategory, getAllCategories, deleteCategory } from "../../auth/adminLogin"; // <-- deleteCategory is added

// Component: Simple Toast Simulation
const Toast = ({ message, type, onClose }) => {
    const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed bottom-5 right-5 ${color} text-white p-4 rounded-lg shadow-xl z-[9999] transition-opacity duration-300 animate-in fade-in slide-in-from-right-4`}>
            <div className="flex items-center gap-2">
                {type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
                <span className="font-semibold text-sm">{message}</span>
            </div>
            <button onClick={onClose} className="absolute top-1 right-1 text-white/80 hover:text-white">
                <X size={16} />
            </button>
        </div>
    );
};

// Component to display image and name
const ImageCell = ({ name, imageUrl }) => (
    <div className="flex items-center gap-3">
        {imageUrl ? (
            <img 
                src={imageUrl} 
                alt={name} 
                className="w-10 h-10 object-cover rounded-md border border-gray-200"
            />
        ) : (
            <div className="w-10 h-10 bg-gray-100 text-gray-400 flex items-center justify-center rounded-md">
                <Layers size={18} />
            </div>
        )}
        <span className="font-bold text-slate-800">{name}</span>
    </div>
);


const Categories = () => {
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'marketplace' | 'shops'
  const [categoryNameState, setCategoryNameState] = useState('');
  const [imageFileState, setImageFileState] = useState(null);
  
  // --- NEW STATE FOR API DATA ---
  const [categoriesData, setCategoriesData] = useState([]); // Holds API data
  const [isLoading, setIsLoading] = useState(true);

  // --- MODAL & TOAST STATE ---
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const [toastConfig, setToastConfig] = useState({ message: '', type: '', show: false });

  // --- DATA FETCHING EFFECT ---
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
        const data = await getAllCategories();
        setCategoriesData(data); 
    } catch (err) {
        setToastConfig({ message: `Failed to fetch categories: ${err.message || 'Error'}`, type: 'error', show: true });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* activeTab */]); // Re-fetch on tab change if data is tab-specific

  // --- HELPERS (rest of helpers remain the same) ---
  const getCurrentData = () => {
    return categoriesData.map(item => ({
        id: item._id,
        name: item.name,
        image: item.image,
        status: item.status ? 'Active' : 'Disabled', // Convert boolean status to string
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        // Mock sub-categories for displaying in the table structure (since API lacks it)
        subs: ['Sub 1', 'Sub 2'], 
    }));
  };

  const getTabLabel = () => {
    if (activeTab === 'local') return 'Local Needs';
    if (activeTab === 'marketplace') return 'Marketplace';
    return 'Shops';
  };

  // --- MODAL HANDLERS (remain the same) ---
  const openModal = (type, data = null) => {
    if (type === 'add') {
        setCategoryNameState('');
        setImageFileState(null);
    }
    setModalConfig({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', data: null });
  };

  // --- API / SAVE HANDLER (UPDATED) ---
  const handleSaveChanges = async () => {
    
    // --- ADD CATEGORY LOGIC (remains the same) ---
    if (modalConfig.type === 'add') {
        if (!categoryNameState.trim() || !imageFileState) {
            setToastConfig({ message: "Name and Image are required.", type: 'error', show: true });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', categoryNameState); 
            formData.append('image', imageFileState);   

            await addCategory(formData); 
            
            setToastConfig({ message: "Category added successfully!", type: 'success', show: true });

            setCategoryNameState('');
            setImageFileState(null);
            closeModal();
            fetchCategories(); // Refresh list
        
        } catch (err) {
            setToastConfig({ message: `Error adding category: ${err.message || 'API Error'}`, type: 'error', show: true });
        }
        return; // Exit function after handling add
    } 

    // --- DELETE CATEGORY LOGIC (NEW) ---
    if (modalConfig.type === 'delete') {
        const categoryId = modalConfig.data?.id; 

        if (!categoryId) {
            setToastConfig({ message: "Category ID is missing for deletion.", type: 'error', show: true });
            return;
        }

        try {
            await deleteCategory(categoryId); // Call the new API function
            
            setToastConfig({ message: "Category deleted successfully!", type: 'success', show: true });

            closeModal();
            fetchCategories(); // Refresh list after deletion
        
        } catch (err) {
            setToastConfig({ message: `Error deleting category: ${err.message || 'API Error'}`, type: 'error', show: true });
        }
        return; // Exit function after handling delete
    }

    // --- PLACEHOLDER LOGIC FOR OTHER MODAL TYPES (remains the same) ---
    else {
        // Placeholder for edit, status, reorder save actions
        console.log(`Handling Save Changes for: ${modalConfig.type}`);
        closeModal();
        setToastConfig({ message: `${getTabLabel()} ${modalConfig.type} updated successfully (Simulated).`, type: 'success', show: true });
    }
};

  // --- COMPONENT: Action Button (unchanged) ---
  const ActionBtn = ({ icon: Icon, color, onClick, tooltip }) => (
    <button 
      onClick={onClick} 
      title={tooltip}
      className={`p-2 rounded-lg border hover:bg-gray-50 transition-colors ${color} bg-white border-gray-200`}
    >
      <Icon size={16} />
    </button>
  );

  // --- COMPONENT: Status Badge (unchanged) ---
  const StatusBadge = ({ status }) => {
    const isActive = status === 'Active' || status === true;
    const label = isActive ? 'Active' : 'Disabled';
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {label}
        </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans text-slate-800 relative">
      
      {/* HEADER (unchanged) */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Categories & Master Data</h1>
        <p className="text-slate-500 text-sm">Manage Main Categories, Sub-categories and Ordering</p>
      </div>

      {/* TABS (unchanged) */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { id: 'local', label: 'Local Needs' },
          { id: 'marketplace', label: 'Marketplace' },
          { id: 'shops', label: 'Shops' }
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

      {/* --- MAIN CONTENT CARD (unchanged) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Card Header (unchanged) */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${getTabLabel()}...`}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => openModal('reorder', getCurrentData())}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-50 font-medium"
             >
                <Move size={16} /> Reorder List
             </button>
             <button 
                onClick={() => openModal('add')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
             >
               <PlusCircle size={16} /> Add Category
             </button>
          </div>
        </div>

        {/* Table (unchanged from previous update) */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 w-24">ID</th>
              <th className="p-4">Main Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">Loading categories...</td>
                </tr>
            ) : getCurrentData().length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">No categories found.</td>
                </tr>
            ) : (
              getCurrentData().map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 text-xs font-mono text-gray-400">{item.id}</td>
                  <td className="p-4">
                    <ImageCell name={item.name} imageUrl={item.image} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-4 text-sm text-gray-600">{item.createdAt}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <ActionBtn icon={Edit3} color="text-amber-500" tooltip="Edit" onClick={() => openModal('edit', item)} />
                      <ActionBtn icon={Power} color={item.status === 'Active' ? 'text-green-600' : 'text-gray-400'} tooltip="Enable/Disable" onClick={() => openModal('status', item)} />
                      <ActionBtn icon={Trash2} color="text-red-400" tooltip="Delete" onClick={() => openModal('delete', item)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* ================= MODAL IMPLEMENTATION (unchanged logic) ================= */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 pb-0">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {modalConfig.type === 'add' && <><PlusCircle className="text-blue-500" size={20}/> Add New Category</>}
                  {modalConfig.type === 'edit' && <><Edit3 className="text-amber-500" size={20}/> Edit Category</>}
                  {modalConfig.type === 'reorder' && <><Move className="text-slate-500" size={20}/> Reorder Categories</>}
                  {modalConfig.type === 'delete' && <><ShieldAlert className="text-red-500" size={20}/> Delete Category</>}
                  {modalConfig.type === 'status' && <><Power className="text-green-500" size={20}/> Update Status</>}
                </h2>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  {getTabLabel()} Section
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* --- ADD / EDIT FORM (unchanged) --- */}
              {(modalConfig.type === 'add' || modalConfig.type === 'edit') && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category Name (Main)</label>
                    <input 
                      type="text" 
                      value={modalConfig.type === 'add' ? categoryNameState : undefined}
                      onChange={(e) => modalConfig.type === 'add' && setCategoryNameState(e.target.value)}
                      defaultValue={modalConfig.type === 'edit' ? modalConfig.data?.name || '' : undefined}
                      placeholder="e.g. Home Services"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>

                  {/* Category Image Input */}
                  {modalConfig.type === 'add' && (
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category Image</label>
                          <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImageFileState(e.target.files[0])}
                              className="w-full text-sm text-slate-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out"
                          />
                          {imageFileState && (
                              <p className="text-[10px] text-gray-400 mt-1">Selected: {imageFileState.name}</p>
                          )}
                      </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="activeStatus" defaultChecked={modalConfig.data?.status === 'Active' || true} className="rounded text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="activeStatus" className="text-sm text-slate-700 font-medium">Enable Immediately</label>
                  </div>
                </>
              )}

              {/* --- REORDER LIST UI (unchanged) --- */}
              {modalConfig.type === 'reorder' && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                   <p className="text-sm text-gray-500 mb-3">Drag items to reorder (Simulation)</p>
                   {(modalConfig.data || []).map((item, idx) => (
                     <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-gray-100 transition">
                        <span className="text-gray-400 font-mono text-xs">{idx + 1}</span>
                        <GripVertical size={16} className="text-gray-400" />
                        <span className="font-medium text-slate-700 text-sm flex-1">{item.name}</span>
                        <div className="text-xs text-gray-400 px-2 bg-white rounded border border-gray-200">{item.id}</div>
                     </div>
                   ))}
                </div>
              )}

              {/* --- DELETE CONFIRMATION (unchanged) --- */}
              {modalConfig.type === 'delete' && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-100">
                  <p>Are you sure you want to delete <b>{modalConfig.data?.name}</b>?</p>
                  <p className="mt-2 text-xs opacity-80">This will also delete {modalConfig.data?.subs?.length || 0} sub-categories associated with it.</p>
                </div>
              )}

              {/* --- STATUS TOGGLE (unchanged) --- */}
              {modalConfig.type === 'status' && (
                <div className="text-center py-4">
                  <p className="text-slate-700 mb-4">
                    Current Status: <b>{modalConfig.data?.status}</b>
                  </p>
                  <p className="text-sm text-gray-500">
                    Do you want to {modalConfig.data?.status === 'Active' ? 'Disable' : 'Enable'} this category?
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer (unchanged) */}
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
                {modalConfig.type === 'delete' ? 'Delete' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= TOAST RENDERER (unchanged) ================= */}
      {toastConfig.show && (
        <Toast 
            message={toastConfig.message} 
            type={toastConfig.type} 
            onClose={() => setToastConfig({ ...toastConfig, show: false })} 
        />
      )}

    </div>
  );
};

export default Categories;