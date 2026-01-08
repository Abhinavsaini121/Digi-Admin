 import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
// import Dashboard from "./pages/Dashboard/WorkerDashboard";
import Login from "./Authentication/Login";

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
      </Route>
    </Routes>
  );
}

export default App;
