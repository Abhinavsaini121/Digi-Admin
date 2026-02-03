import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";
// Pages Imports
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./Authentication/Login";
import ManageUsers from "./pages/User_Management/ManageUsers";
import LocalNeeds from "./pages/LocalNeeds/LocalNeeds";
import PartTimeJobs from "./pages/Jobs/PartTimeJobs";
import FullTimeJobs from "./pages/Jobs/FullTimeJobs";
import Marketplace from "./pages/Marketplace/Marketplace";
import Credit from "./pages/Credits-Management/Credits";
import BloodRequest from "./pages/Safety/BloodRequest";
import SosAlert from "./pages/Safety/SOS Alert";
import Category from "./pages/Categories/Categories";
import Notification from "./pages/Notifications/Notification";
import ShopManage from "./pages/ShopManagement/shopmanage";
import Moderation from "./pages/ModerationBlocking/Moderationblocking";
import Setting from "./pages/SystemSetting/Systemsetting";
import Reports from "./pages/Report_Export/Report_export";
import Business from "./pages/Business_Varifies/business-verify";
function App() {
  return (
    <Routes>

      {/* Redirect Root to Login initially */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes (Admin Panel) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="/usersmanagement" element={<ManageUsers />} />
        <Route path="/needsManagement" element={<LocalNeeds />} />
        <Route path="/PartTimeJobs" element={<PartTimeJobs />} />
        <Route path="/FullTimeJobs" element={<FullTimeJobs />} />
        <Route path="/Marketplace" element={<Marketplace />} />
        <Route path="/shop-management" element={<ShopManage />} />
        <Route path="/sosAlert" element={< SosAlert />} />
        <Route path="/blood-request" element={<BloodRequest />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/category" element={<Category />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/moderationblocking" element={<Moderation />} />
        <Route path="/systemsetting" element={<Setting />} />
        <Route path="/report" element={<Reports />} />
        <Route path="/business" element={<Business />} />

      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;