import { useState } from "react";
import Header from "../components/Header";
import {Sidebar} from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-purple-50">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header toggleSidebar={() => setSidebarOpen((v) => !v)} />
      </div>

      {/* BODY */}
      <div className="pt-16 flex h-screen overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 overflow-y-auto lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
