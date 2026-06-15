import { useEffect, useState } from "react";
import {
  CreditCard,
  History,
  PlusCircle,
  MinusCircle,
  Calendar,
  Tag,
  Eye,
  Edit3,
  Trash2,
  BarChart3,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllPlans,
  deletePlanAPI,
  updatePlanAPI,
  createPlanAPI,
  searchPlanAPI,
} from "../../auth/credit";
const Credits = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    credits: "",
    description: "",
  });
  const [createForm, setCreateForm] = useState({
    planId: "",
    name: "",
    price: "",
    credits: "",
    category: "SUBSCRIPTION",
    description: "",
  });
  useEffect(() => {
    fetchPlans(1);
  }, []);

  const fetchPlans = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getAllPlans(page, limit);

      setPlans(res?.data || []);

      setTotalPages(res?.pagination?.totalPages || 1);
      setCurrentPage(res?.pagination?.currentPage || page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (value) => {
    try {
      setSearchTerm(value);

      if (!value.trim()) {
        fetchPlans();
        return;
      }

      const res = await searchPlanAPI(value);

      setPlans(res?.data || []);
    } catch (err) {
      console.log(err);
      setPlans([]);
    }
  };
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    data: null,
  });

  const openModal = (type, data) => {
    if (type === "edit") {
      setEditForm({
        name: data?.name || "",
        price: data?.price || "",
        credits: data?.credits || "",
        description: data?.description || "",
      });
    }

    setModalConfig({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: "", data: null });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      CREDIT: "bg-blue-100 text-blue-700",
      SUBSCRIPTION: "bg-purple-100 text-purple-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Credits Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage credit plans and subscriptions
        </p>
      </div>

      {activeTab === "plans" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                placeholder="Search by Plan ID..."
              />
            </div>
            <button
              onClick={() => openModal("create")}
              className="bg-[#090E1A] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Create Plan
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4 text-left w-16">S.No.</th>

                <th className="p-4 text-left">Plan ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Credits</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans?.map((plan, index) => (
                <tr key={plan._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-500">
                    {plan.planId}
                  </td>
                  <td className="p-4 font-semibold">{plan.name}</td>
                  <td className="p-4">
                    <StatusBadge status={plan.category} />
                  </td>
                  <td className="p-4">₹{plan.price}</td>
                  <td className="p-4">{plan.credits}</td>
                  <td className="p-4 text-gray-500">{plan.description}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal("view", plan)}
                        className="p-2 border rounded"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal("edit", plan)}
                        className="p-2 border rounded"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => openModal("delete", plan)}
                        className="p-2 border rounded text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 border-t">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchPlans(currentPage - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchPlans(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-black text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchPlans(currentPage + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {modalConfig.isOpen && modalConfig.type === "delete" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[400px] rounded-xl p-6">
            <h2 className="font-bold text-lg">Confirm Delete</h2>

            <p className="mt-4 text-sm text-gray-600">
              Are you sure you want to delete <b>{modalConfig.data?.name}</b>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="w-1/2 bg-gray-200 text-black py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await deletePlanAPI(modalConfig.data?.planId); // or _id if backend uses _id

                    // remove deleted plan from UI
                    setPlans((prev) =>
                      prev.filter((p) => p.planId !== modalConfig.data?.planId),
                    );

                    closeModal();
                  } catch (err) {
                    console.log("Delete failed:", err);
                  }
                }}
                className="w-1/2 bg-red-600 text-white py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {modalConfig.isOpen && modalConfig.type === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white/95 backdrop-blur-md w-full max-w-3xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#090E1A] to-slate-700 text-white">
              {" "}
              <h2 className="text-2xl font-bold tracking-wide">
                Edit Plan
              </h2>{" "}
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plan Name
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#090E1A] focus:border-[#090E1A] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>

                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#090E1A] focus:border-[#090E1A] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Credits
                  </label>

                  <input
                    type="number"
                    value={editForm.credits}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        credits: e.target.value,
                      })
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  rows="5"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const payload = {
                      name: editForm.name,
                      price: Number(editForm.price),
                      credits: Number(editForm.credits),
                      description: editForm.description,
                    };

                    console.log(payload);

                    await updatePlanAPI(modalConfig.data.planId, payload);

                    closeModal();
                    fetchPlans();
                  } catch (err) {
                    console.log(err);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#090E1A] to-slate-700 text-white hover:scale-105 transition-all"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {modalConfig.isOpen && modalConfig.type === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Plan Details</h2>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Top Card */}
                <div className="bg-gradient-to-r from-[#090E1A] to-slate-700 rounded-2xl p-6 text-white">
                  <p className="text-sm opacity-80">Plan ID</p>
                  <h3 className="text-2xl font-bold">
                    {modalConfig.data?.planId}
                  </h3>

                  <div className="flex gap-3 mt-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {modalConfig.data?.category}
                    </span>

                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {modalConfig.data?.credits} Credits
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Plan Name</p>
                    <p className="font-semibold text-lg">
                      {modalConfig.data?.name}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="font-semibold text-lg text-green-600">
                      ₹ {modalConfig.data?.price}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Credits</p>
                    <p className="font-semibold text-lg">
                      {modalConfig.data?.credits}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Version</p>
                    <p className="font-semibold text-lg">
                      {modalConfig.data?.__v}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">
                    {modalConfig.data?.description}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="font-medium">
                      {new Date(modalConfig.data?.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="border rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Updated At</p>
                    <p className="font-medium">
                      {new Date(modalConfig.data?.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-[#090E1A] text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {modalConfig.isOpen && modalConfig.type === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Plan</h2>

              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Plan ID"
              value={createForm.planId}
              onChange={(e) =>
                setCreateForm({ ...createForm, planId: e.target.value })
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="text"
              placeholder="Plan Name"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="number"
              placeholder="Price"
              value={createForm.price}
              onChange={(e) =>
                setCreateForm({ ...createForm, price: e.target.value })
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="number"
              placeholder="Credits"
              value={createForm.credits}
              onChange={(e) =>
                setCreateForm({ ...createForm, credits: e.target.value })
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            <select
              value={createForm.category}
              onChange={(e) =>
                setCreateForm({ ...createForm, category: e.target.value })
              }
              className="w-full border rounded-lg p-3 mb-3"
            >
              <option value="SUBSCRIPTION">SUBSCRIPTION</option>
              <option value="CREDIT">CREDIT</option>
            </select>

            <textarea
              placeholder="Description"
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mb-3"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const payload = {
                      planId: createForm.planId,
                      name: createForm.name,
                      price: Number(createForm.price),
                      credits: Number(createForm.credits),
                      category: createForm.category,
                      description: createForm.description,
                    };

                    console.log(payload);

                    await createPlanAPI(payload);
                    toast.success("Plan created successfully!");
                    setCreateForm({
                      planId: "",
                      name: "",
                      price: "",
                      credits: "",
                      category: "SUBSCRIPTION",
                      description: "",
                    });

                    closeModal();
                    fetchPlans();
                  } catch (err) {
                    console.log("Create Plan Error:", err);
                    toast.error("Failed to create plan!");
                  }
                }}
                className="px-4 py-2 bg-[#090E1A] text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;
