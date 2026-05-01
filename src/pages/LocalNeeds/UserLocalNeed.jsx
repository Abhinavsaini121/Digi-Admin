import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getPublicUserLocalJobs, deleteLocalJob } from "../../auth/adminLogin";

const UserLocalNeeds = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [page, setPage] = useState(1);
  const [jobType, setJobType] = useState("ADMIN");

  const itemsPerPage = pagination.pageSize || 5;
  const totalPages = pagination.totalPages || 1;

  const currentTasks = tasks;

  // ✅ API CALL
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getPublicUserLocalJobs(page);
        setTasks(res.data || []);
        setPagination(res.pagination || {});
      } catch (err) {
        toast.error("Failed to fetch jobs");
      }
    };

    fetchJobs();
  }, [page]);

  const handleDelete = (id) => {
    setSelectedTaskId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLocalJob(selectedTaskId);

      setTasks((prev) => prev.filter((item) => item._id !== selectedTaskId));

      toast.success("Deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Delete failed");
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Local Needs Management</h1>

        <select
          value={jobType}
          onChange={(e) => {
            const value = e.target.value;
            setJobType(value);
            if (value === "ADMIN") navigate("/needsManagement");
            else navigate("/user-local");
          }}
          className="px-3 py-2 border rounded-lg bg-white shadow-sm"
        >
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Work Type</th>
              <th className="p-4 text-left">WhatsApp No.</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentTasks.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="p-4">
                  <img
                    src={t.images?.[0]}
                    alt="job"
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">{t.title}</td>

                <td className="p-4">
                  {t.location?.address}
                  <br />
                  <span className="text-xs text-gray-500"></span>
                </td>

                <td className="p-4">{t.workType}</td>

                <td className="p-4">
                  {t.whatsappNumber || t.userId?.mobile || "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      t.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center p-4 gap-2 bg-gray-50">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="flex items-center px-2 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex backdrop-blur-md items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete?
            </h2>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLocalNeeds;
