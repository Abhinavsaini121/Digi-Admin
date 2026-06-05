import React, { useState, useEffect } from "react";
import { getAllCouponsAPI, createCouponAPI } from "../../auth/credit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [cartValue, setCartValue] = useState(1200);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    credits: "",
    expiry: "2026-12-31",
    limit: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  useEffect(() => {
    if (appliedCoupon) {
      calculateDiscount(appliedCoupon, cartValue);
    }
  }, [cartValue]);

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
  const calculateDiscount = (coupon, currentCartVal) => {
    let discount = Number(coupon.credits) || 0;
    if (discount > currentCartVal) {
      discount = currentCartVal;
    }
    setDiscountAmount(discount);
  };

  const handleApplyCoupon = () => {
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedCode = couponCodeInput.toUpperCase().trim();
    if (!trimmedCode) {
      setErrorMsg("Please enter a coupon code.");
      return;
    }

    const coupon = coupons.find((c) => c.code === trimmedCode);

    if (!coupon) {
      setErrorMsg("Invalid coupon code.");
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    if (!coupon.status) {
      setErrorMsg("This coupon is currently inactive.");
      return;
    }

    const today = new Date();
    const expiry = new Date(coupon.expiry);
    if (today > expiry) {
      setErrorMsg("This coupon has expired.");
      return;
    }

    if (coupon.totalUsed >= coupon.limit) {
      setErrorMsg("Coupon usage limit has been reached.");
      return;
    }

    setAppliedCoupon(coupon);
    calculateDiscount(coupon, cartValue);
    setSuccessMsg(`${coupon.credits} credits applied using ${coupon.code}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCodeInput("");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const openDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCoupon = () => {
    if (couponToDelete) {
      setCoupons(coupons.filter((c) => c.id !== couponToDelete.id));
      if (appliedCoupon && appliedCoupon.id === couponToDelete.id) {
        handleRemoveCoupon();
      }
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
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

  const handleUpdateCoupon = (e) => {
    e.preventDefault();
    const uppercaseCode = editCouponData.code.toUpperCase().trim();

    if (
      coupons.some(
        (c) => c.code === uppercaseCode && c.id !== editCouponData.id,
      )
    ) {
      alert("This coupon code already exists!");
      return;
    }

    const updatedCoupons = coupons.map((c) => {
      if (c.id === editCouponData.id) {
        const updated = {
          ...c,
          code: uppercaseCode,
          credits: Number(editCouponData.credits),
          expiry: editCouponData.expiry,
          limit: Number(editCouponData.limit) || 100,
        };
        if (appliedCoupon && appliedCoupon.id === c.id) {
          setAppliedCoupon(updated);
          calculateDiscount(updated, cartValue);
        }
        return updated;
      }
      return c;
    });

    setCoupons(updatedCoupons);
    setIsEditModalOpen(false);
  };

  const finalPrice = cartValue - discountAmount;

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

        <div style={styles.column}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Shopping Cart Simulator</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Enter Cart Amount (₹)</label>
              <input
                type="number"
                value={cartValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCartValue(val < 0 ? 0 : val);
                }}
                style={{
                  ...styles.input,
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              />
            </div>

            <div style={styles.couponInputArea}>
              <input
                type="text"
                placeholder="ENTER PROMO CODE"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                disabled={!!appliedCoupon}
                style={{
                  ...styles.input,
                  textTransform: "uppercase",
                  flex: 1,
                  margin: 0,
                  opacity: appliedCoupon ? 0.7 : 1,
                }}
              />
              {appliedCoupon ? (
                <button onClick={handleRemoveCoupon} style={styles.btnRemove}>
                  Remove
                </button>
              ) : (
                <button onClick={handleApplyCoupon} style={styles.btnApply}>
                  Apply
                </button>
              )}
            </div>

            {errorMsg && <div style={styles.errorText}>{errorMsg}</div>}
            {successMsg && <div style={styles.successText}>{successMsg}</div>}

            <div style={styles.billContainer}>
              <h3 style={styles.billTitle}>Checkout Summary</h3>

              <div style={styles.billRow}>
                <span>Subtotal Amount:</span>
                <span>₹{cartValue.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div style={{ ...styles.billRow, color: "#059669" }}>
                  <span>Coupon Applied ({appliedCoupon.code}):</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={styles.divider}></div>

              <div
                style={{
                  ...styles.billRow,
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                <span>Final Price:</span>
                <span>₹{finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {appliedCoupon && (
              <div style={styles.savedBanner}>
                🎉 Total savings of ₹{discountAmount.toFixed(2)} successfully
                applied!
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={styles.cardFull}>
          <h2 style={styles.cardTitle}>Available Offers</h2>
          <div style={styles.couponGrid}>
            {coupons.map((coupon) => (
              <div key={coupon.id} style={styles.couponCard}>
                <div style={styles.couponHeader}>
                  <span style={styles.couponBadge}>{coupon.code}</span>
                  <div style={styles.actionButtonGroup}>
                    <button
                      onClick={() => {
                        setCouponCodeInput(coupon.code);
                        setErrorMsg("");
                      }}
                      style={styles.actionBtnCopy}
                      title="Copy Code"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => openEditModal(coupon)}
                      style={styles.actionBtnEdit}
                      title="Edit Coupon"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(coupon)}
                      style={styles.actionBtnDelete}
                      title="Delete Coupon"
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
              <div style={styles.formGroup}>
                <label style={styles.label}>Credits *</label>
                <input
                  type="number"
                  value={editCouponData.credits}
                  onChange={(e) =>
                    setEditCouponData({
                      ...editCouponData,
                      credits: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Usage Limit</label>
                <input
                  type="number"
                  value={editCouponData.limit}
                  onChange={(e) =>
                    setEditCouponData({
                      ...editCouponData,
                      limit: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Expiry Date</label>
                <input
                  type="date"
                  value={editCouponData.expiry}
                  onChange={(e) =>
                    setEditCouponData({
                      ...editCouponData,
                      expiry: e.target.value,
                    })
                  }
                  style={styles.input}
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
    padding: "24px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1f2937",
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
