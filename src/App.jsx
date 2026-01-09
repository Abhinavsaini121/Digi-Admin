 import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
// import Dashboard from "./pages/Dashboard/WorkerDashboard";
import Login from "./Authentication/Login";
import ManageUsers from "./pages/User_Management/ManageUsers";
import ReportsAnalytics from "./pages/Reports & Analytics/Reports";
import LocalNeeds from "./pages/LocalNeeds/LocalNeeds";
import PartTimeJobs from "./pages/Jobs/PartTimeJobs";
import FullTimeJobs from "./pages/Jobs/FullTimeJobs";
import Marketplace from "./pages/Marketplace/Marketplace";

function App() {
  return (
    <Routes>
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login - Without Layout */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Pages */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/usersmanagement" element={<ManageUsers />} />
        <Route path="/Reports" element={<ReportsAnalytics />} />
        <Route path="/needsManagement" element={<LocalNeeds />} />
        <Route path="/PartTimeJobs" element={<PartTimeJobs />} />
        <Route path="/FullTimeJobs" element={<FullTimeJobs />} />
        <Route path="/Marketplace" element={<Marketplace />} />
      </Route>
      
    </Routes>
  );
}

export default App;
