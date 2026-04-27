import React, { useState } from "react";
import { Trash2, Eye, MapPin, Briefcase, Star, X, Search, Loader2 } from "lucide-react";

const UserFullJobs = () => {
    // --- STATIC / DUMMY DATA ---
    const [jobs, setJobs] = useState([
        {
            _id: "1",
            title: "Senior Software Engineer",
            location: { address: "Bangalore, Karnataka, India" },
            salaryRange: { min: "15L", max: "25L" },
            jobCategory: "FULL_TIME_JOB",
            isFeatured: true,
            images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop"],
        },
        {
            _id: "2",
            title: "Full Stack Developer",
            location: { address: "Mumbai, Maharashtra, India" },
            salaryRange: { min: "12L", max: "18L" },
            jobCategory: "FULL_TIME_JOB",
            isFeatured: false,
            images: [],
        },
        {
            _id: "3",
            title: "Product Designer (UI/UX)",
            location: { address: "Remote, India" },
            salaryRange: { min: "10L", max: "15L" },
            jobCategory: "FULL_TIME_JOB",
            isFeatured: true,
            images: ["https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop"],
        },
        {
            _id: "4",
            title: "Marketing Manager",
            location: { address: "Delhi, India" },
            salaryRange: { min: "8L", max: "12L" },
            jobCategory: "FULL_TIME_JOB",
            isFeatured: false,
            images: [],
        },
        {
            _id: "5",
            title: "Data Scientist",
            location: { address: "Hyderabad, Telangana" },
            salaryRange: { min: "20L", max: "35L" },
            jobCategory: "FULL_TIME_JOB",
            isFeatured: true,
            images: ["https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop"],
        }
    ]);

    // States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobIdToDelete, setJobIdToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Delete Logic (Static)
    const confirmDelete = () => {
        setJobs(jobs.filter(job => job._id !== jobIdToDelete));
        setIsDeleteModalOpen(false);
        setJobIdToDelete(null);
    };

    // Filter Search
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-job-container">
            {/* INTERNAL CSS */}
            <style>{`
        .admin-job-container {
          padding: 2rem;
          background-color: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #334155;
        }

        /* Header Section */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .page-title p {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 2px;
        }

        .search-box {
          position: relative;
          width: 300px;
        }

        .search-box input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          outline: none;
          background: white;
          font-size: 0.875rem;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        /* Table Card Layout */
        .table-wrapper {
          background: white;
          border-radius: 1.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          padding: 1rem 1.5rem;
          background-color: #f8fafc;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }

        td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          vertical-align: middle;
        }

        tr:hover {
          background-color: #fdfdfd;
        }

        /* Job Detail Column */
        .job-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .job-logo {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #dbeafe;
        }

        .job-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .job-name {
          font-weight: 700;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .job-loc {
          font-size: 0.7rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 2px;
        }

        /* Status & Badges */
        .salary-badge {
          font-weight: 800;
          color: #334155;
        }

        /* Action Buttons */
        .action-flex {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 700;
          border-radius: 6px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-view {
          background-color: #f0f7ff;
          color: #2563eb;
          border-color: #dbeafe;
        }

        .btn-view:hover { background: #2563eb; color: white; }

        .btn-del {
          background-color: #fef2f2;
          color: #dc2626;
          border-color: #fee2e2;
        }

        .btn-del:hover { background: #dc2626; color: white; }

        /* Modal Overlay */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal {
          background: white;
          width: 100%;
          max-width: 380px;
          padding: 2rem;
          border-radius: 1.5rem;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .icon-box {
          width: 64px;
          height: 64px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .modal-btns {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .modal-btns button {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
        }

        .c-cancel { background: #f1f5f9; color: #64748b; }
        .c-delete { background: #dc2626; color: white; }
      `}</style>

            {/* Header */}
            <div className="page-header">
                <div className="page-title">
                    <h1>Full-time Job Management</h1>
                    <p>You have {jobs.length} active listings</p>
                </div>
                <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "60px" }}>S.No</th>
                            <th>Job Information</th>
                            <th>Compensation (LPA)</th>
                            <th style={{ textAlign: "center" }}>Featured</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, index) => (
                                <tr key={job._id}>
                                    <td style={{ fontWeight: "700", color: "#cbd5e1" }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </td>
                                    <td>
                                        <div className="job-cell">
                                            <div className="job-logo">
                                                {job.images[0] ? (
                                                    <img src={job.images[0]} alt="job" />
                                                ) : (
                                                    <Briefcase size={20} color="#94a3b8" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="job-name">{job.title}</div>
                                                <div className="job-loc">
                                                    <MapPin size={10} /> {job.location.address.split(',')[0]}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="salary-badge">
                                            ₹{job.salaryRange.min} - {job.salaryRange.max}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <Star
                                            size={20}
                                            fill={job.isFeatured ? "#fbbf24" : "none"}
                                            stroke={job.isFeatured ? "#fbbf24" : "#e2e8f0"}
                                            style={{ margin: "0 auto" }}
                                        />
                                    </td>
                                    <td>
                                        <div className="action-flex">
                                            <button className="btn btn-view"><Eye size={12} /> View</button>
                                            <button
                                                className="btn btn-del"
                                                onClick={() => { setJobIdToDelete(job._id); setIsDeleteModalOpen(true); }}
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                                    No full-time jobs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* DELETE MODAL */}
            {isDeleteModalOpen && (
                <div className="overlay">
                    <div className="modal">
                        <div className="icon-box">
                            <Trash2 size={32} />
                        </div>
                        <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Are you sure?</h2>
                        <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: "1.5" }}>
                            Do you really want to delete this job? This process cannot be undone and the data will be lost.
                        </p>
                        <div className="modal-btns">
                            <button className="c-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="c-delete" onClick={confirmDelete}>Delete Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFullJobs;