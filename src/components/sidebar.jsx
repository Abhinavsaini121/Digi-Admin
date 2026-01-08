import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function Sidebar({ sidebarOpen, closeSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [sidebarOpen]);

  return (
    <>
      {/* OVERLAY (MOBILE ONLY) */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-16 left-0 z-40
          w-64 h-[calc(100vh-64px)]
          bg-gradient-to-b from-orange-50 to-white
          border-r border-orange-100 shadow-xl
          p-5
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav>
          {/* Dashboard Only */}
          <div
            onClick={() => {
              navigate("/");
              closeSidebar();
            }}
            className="flex items-center gap-4 p-3 rounded-xl
              text-gray-700 font-medium cursor-pointer
              hover:bg-orange-100 hover:text-[#FE702E]"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
