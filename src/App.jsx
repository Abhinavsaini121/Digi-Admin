 import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
// import Dashboard from "./pages/Dashboard/WorkerDashboard";
import Login from "./Authentication/Login";
import ManageUsers from "./pages/User_Management/ManageUsers";
import ReportsAnalytics from "./pages/Reports & Analytics/Reports";

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
      </Route>
      
    </Routes>
  );
}

export default App;
