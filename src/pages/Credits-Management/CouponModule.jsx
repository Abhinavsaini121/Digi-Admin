import React, { useState, useEffect } from "react";
import {
  getAllCouponsAPI,
  createCouponAPI,
  searchCouponAPI,
  deleteCouponAPI,
  updateCouponAPI,
} from "../../auth/credit";
import CouponDetailsModal from "../../components/CouponDetailsModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    credits: "",
    expiry: "2026-12-31",
    limit: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [editCouponData, setEditCouponData] = useState({
    id: "",
    code: "",
    credits: "",
    expiry: "",
    limit: "",
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAllCouponsAPI();
        if (response && response.success) {
          setCoupons(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoupons();
  }, []);

  const handleSearchCoupon = async (value) => {
    setSearchTerm(value);

    try {
      if (!value.trim()) {
        const response = await getAllCouponsAPI();
        setCoupons(response.data);
        return;
      }

      const response = await searchCouponAPI(value);

      if (response?.success) {
        setCoupons(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    if (!newCoupon.code || !newCoupon.credits || !newCoupon.expiry) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const payload = {
        code: newCoupon.code.toUpperCase().trim(),
        credits: Number(newCoupon.credits),
        expiryDate: newCoupon.expiry, // IMPORTANT: matches API field
        usageLimit: Number(newCoupon.limit) || 100,
      };

      const response = await createCouponAPI(payload);

      if (response?.success) {
        setCoupons((prev) => [...prev, response.data]);
        setNewCoupon({
          code: "",
          credits: "",
          expiry: "2026-12-31",
          limit: "",
        });
        toast.success("Coupon created successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to create coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
  };
  const openDeleteModal = (coupon) => {
    console.log("Clicked coupon =", coupon);

    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCoupon = async () => {
    console.log("couponToDelete =", couponToDelete);

    if (!couponToDelete) return;

    try {
      console.log("couponToDelete =", couponToDelete);
      const response = await deleteCouponAPI(couponToDelete.id);

      if (response?.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete.id));

        if (appliedCoupon && appliedCoupon._id === couponToDelete._id) {
          handleRemoveCoupon();
        }

        toast.success(response.message || "Coupon deleted successfully!");

        setIsDeleteModalOpen(false);
        setCouponToDelete(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to delete coupon");
    }
  };
  const openEditModal = (coupon) => {
    setEditCouponData({
      id: coupon.id,
      code: coupon.code,
      credits: coupon.credits,
      expiry: coupon.expiry,
      limit: coupon.limit,
    });
    setIsEditModalOpen(true);
  };
  const openCouponDetails = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        code: editCouponData.code.toUpperCase().trim(),
      };

      const response = await updateCouponAPI(editCouponData.id, payload);

      if (response?.success) {
        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon.id === editCouponData.id
              ? {
                  ...coupon,
                  code: payload.code,
                }
              : coupon,
          ),
        );

        toast.success(response.message || "Coupon updated successfully!");

        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to update coupon");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Coupon Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage coupons and promotional offers
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.column}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Create Coupon (Admin)</h2>
            <form onSubmit={handleCreateCoupon} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER30"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Credits *</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={newCoupon.credits}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, credits: e.target.value })
                    }
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Usage Limit</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={newCoupon.limit}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, limit: e.target.value })
                    }
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Expiry Date</label>
                <input
                  type="date"
                  value={newCoupon.expiry}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, expiry: e.target.value })
                  }
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.btnPrimary}>
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={styles.cardFull}>
          <h2 style={styles.cardTitle}>Available Offers</h2>

          <div className="mt-4 mb-4">
            <input
              type="text"
              placeholder="Search coupon by code..."
              value={searchTerm}
              onChange={(e) => handleSearchCoupon(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div style={styles.couponGrid}>
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                style={styles.couponCard}
                onClick={() => openCouponDetails(coupon)}
              >
                <div style={styles.couponHeader}>
                  <span style={styles.couponBadge}>{coupon.code}</span>
                  <div style={styles.actionButtonGroup}>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await navigator.clipboard.writeText(coupon.code);
                          setCouponCodeInput(coupon.code);
                          toast.success("Coupon code copied!");
                        } catch {
                          toast.error("Failed to copy code");
                        }
                      }}
                      style={styles.actionBtnCopy}
                    >
                      Copy
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(coupon);
                      }}
                      style={styles.actionBtnEdit}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(coupon);
                      }}
                      style={styles.actionBtnDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={styles.couponBody}>
                  <div style={styles.couponDetailsRow}>
                    <span style={styles.detailLabel}>Credits:</span>
                    <span style={styles.detailValue}>{coupon.credits}</span>
                  </div>
                  <div style={styles.couponDetailsRow}>
                    <span style={styles.detailLabel}>Usage:</span>
                    <span style={styles.detailValue}>
                      {coupon.totalUsed} / {coupon.limit}
                    </span>
                  </div>
                  <div style={styles.couponDetailsRow}>
                    <span style={styles.detailLabel}>Expiry:</span>
                    <span style={styles.detailValue}>
                      {new Date(coupon.expiry).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {coupons.length === 0 && (
              <div style={styles.noCoupons}>No coupons available.</div>
            )}
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Delete Coupon</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete coupon{" "}
              <strong>{couponToDelete?.code}</strong>? This action cannot be
              undone.
            </p>
            <div style={styles.modalFooter}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={styles.modalBtnSecondary}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCoupon}
                style={styles.modalBtnDanger}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Edit Coupon</h3>
            <form onSubmit={handleUpdateCoupon} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Coupon Code *</label>
                <input
                  type="text"
                  value={editCouponData.code}
                  onChange={(e) =>
                    setEditCouponData({
                      ...editCouponData,
                      code: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={styles.modalBtnSecondary}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.modalBtnPrimary}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <CouponDetailsModal
        isOpen={isDetailsModalOpen}
        coupon={selectedCoupon}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCoupon(null);
        }}
      />
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
  },
  cardFull: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
    width: "100%",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "20px",
    borderBottom: "2px solid #f3f4f6",
    paddingBottom: "10px",
    color: "#1f2937",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
    marginTop: "10px",
  },
  couponGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  couponCard: {
    backgroundColor: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  couponHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  couponBadge: {
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: "14px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  actionButtonGroup: {
    display: "flex",
    gap: "6px",
  },
  actionBtnCopy: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  actionBtnEdit: {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  actionBtnDelete: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  couponBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  couponDetailsRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
  },
  detailLabel: {
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    color: "#1f2937",
    fontWeight: "600",
  },
  noCoupons: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#9ca3af",
    padding: "20px",
    fontSize: "14px",
  },
  couponInputArea: {
    display: "flex",
    gap: "10px",
    margin: "16px 0",
  },
  btnApply: {
    backgroundColor: "#059669",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "0 20px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  btnRemove: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "0 20px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  errorText: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  successText: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  billContainer: {
    backgroundColor: "#f9fafb",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #f3f4f6",
  },
  billTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#4b5563",
  },
  billRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "10px",
    fontWeight: "500",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "14px 0",
  },
  savedBanner: {
    marginTop: "16px",
    textAlign: "center",
    backgroundColor: "#d1fae5",
    color: "#047857",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "480px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
    position: "relative",
    animation: "fadeIn 0.25s ease",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "2px solid #f3f4f6",
  },
  modalText: {
    fontSize: "14px",
    color: "#4b5563",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  modalBtnSecondary: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  modalBtnDanger: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  modalBtnPrimary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
};
