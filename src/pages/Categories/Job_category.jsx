import React, { useState } from "react";

export default function JobCategoryModule() {
  // Dummy Initial Data
  const initialCategories = [
    {
      id: 1,
      name: "Software Engineering",
      description:
        "Frontend, backend, fullstack, and mobile application development.",
      count: 142,
    },
    {
      id: 2,
      name: "Design & Creative",
      description:
        "UI/UX, graphic design, motion design, and product design specialists.",
      count: 85,
    },
    {
      id: 3,
      name: "Marketing & Sales",
      description:
        "SEO, growth marketing, social media, and digital sales strategy.",
      count: 58,
    },
    {
      id: 4,
      name: "Product Management",
      description: "Product owners, technical PMs, and agile scrum masters.",
      count: 39,
    },
  ];

  // State Management
  const [categories, setCategories] = useState(initialCategories);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    count: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create or Update Category
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      // Update Mode
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingId
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                count: Number(formData.count) || 0,
              }
            : cat,
        ),
      );
      setEditingId(null);
    } else {
      // Create Mode
      const newCategory = {
        id: Date.now(), // simple unique ID
        name: formData.name,
        description: formData.description,
        count: Number(formData.count) || 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    // Reset Form
    setFormData({ name: "", description: "", count: "" });
  };

  // Edit Trigger
  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
      count: category.count,
    });
  };

  // Delete Category
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", count: "" });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="jcm-container">
      {/* Scope-isolated CSS Styles */}
      <style>{`
        .jcm-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 1100px;
          margin: 2rem auto;
          padding: 1.5rem;
          background-color: #f8fafc;
          color: #1e293b;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }

        .jcm-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .jcm-header h1 {
          font-size: 2rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .jcm-header p {
          color: #64748b;
          font-size: 0.95rem;
        }

        .jcm-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .jcm-grid {
            grid-template-columns: 350px 1fr;
          }
        }

        /* Form Styling */
        .jcm-card {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          height: fit-content;
        }

        .jcm-card-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: #334155;
        }

        .jcm-form-group {
          margin-bottom: 1rem;
        }

        .jcm-form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          color: #475569;
        }

        .jcm-input, .jcm-textarea {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }

        .jcm-input:focus, .jcm-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }

        .jcm-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .jcm-btn-group {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }

        .jcm-btn {
          padding: 0.6rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 100%;
        }

        .jcm-btn-primary {
          background-color: #2563eb;
          color: #ffffff;
        }

        .jcm-btn-primary:hover {
          background-color: #1d4ed8;
        }

        .jcm-btn-secondary {
          background-color: #64748b;
          color: #ffffff;
        }

        .jcm-btn-secondary:hover {
          background-color: #475569;
        }

        /* Search Section */
        .jcm-search-bar {
          margin-bottom: 1.5rem;
        }

        .jcm-search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        /* List Section */
        .jcm-list-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .jcm-item-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .jcm-item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .jcm-item-info {
          flex: 1;
          padding-right: 1rem;
        }

        .jcm-item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jcm-badge {
          background-color: #eff6ff;
          color: #1d4ed8;
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-weight: 600;
        }

        .jcm-item-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.4;
        }

        .jcm-item-actions {
          display: flex;
          gap: 0.5rem;
        }

        .jcm-action-btn {
          background: none;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 0.35rem 0.6rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .jcm-btn-edit:hover {
          background-color: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .jcm-btn-delete:hover {
          background-color: #fef2f2;
          border-color: #fca5a5;
          color: #dc2626;
        }

        .jcm-no-results {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
          background: #ffffff;
          border-radius: 8px;
          border: 1px dashed #cbd5e1;
        }
      `}</style>

      {/* Header */}
      <div className="jcm-header">
        <h1>Job Category Dashboard</h1>
        <p>Manage, create, and filter your job classifications</p>
      </div>

      <div className="jcm-grid">
        {/* Left Column: Form Section */}
        <div className="jcm-card">
          <h2 className="jcm-card-title">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="jcm-form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="jcm-input"
                placeholder="e.g. Finance & Accounting"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="jcm-form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="jcm-textarea"
                placeholder="Brief summary of the job category..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="jcm-form-group">
              <label htmlFor="count">Active Job Openings</label>
              <input
                type="number"
                id="count"
                name="count"
                className="jcm-input"
                placeholder="0"
                min="0"
                value={formData.count}
                onChange={handleInputChange}
              />
            </div>

            <div className="jcm-btn-group">
              <button type="submit" className="jcm-btn jcm-btn-primary">
                {editingId ? "Update" : "Save"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="jcm-btn jcm-btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Listing & Search */}
        <div>
          <div className="jcm-search-bar">
            <input
              type="text"
              className="jcm-search-input"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="jcm-list-container">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="jcm-item-card">
                  <div className="jcm-item-info">
                    <div className="jcm-item-title">
                      {category.name}
                      <span className="jcm-badge">{category.count} Jobs</span>
                    </div>
                    {category.description && (
                      <p className="jcm-item-desc">{category.description}</p>
                    )}
                  </div>
                  <div className="jcm-item-actions">
                    <button
                      className="jcm-action-btn jcm-btn-edit"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="jcm-action-btn jcm-btn-delete"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="jcm-no-results">
                No job categories found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
