import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MapPin,
  Briefcase,
  ShoppingBag,
  Store,
  Coins,
  CreditCard,
  Shield,
  BarChart,
  Layers,
  AlertTriangle,
  Bell,
  Image,
  HelpCircle,
  Activity,
  Settings,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: Home,
    route: "/dashboard",
  },
  {
    label: "Users",
    icon: Users,
    children: [
      { label: "All Users", route: "/users/all" },
      { label: "User Activity", route: "/users/activity" },
    ],
  },
  {
    label: "Local Needs",
    icon: MapPin,
    children: [
      { label: "All Tasks", route: "/local-needs/tasks" },
      { label: "Categories Stats", route: "/local-needs/categories-stats" },
    ],
  },
  {
    label: "Jobs",
    icon: Briefcase,
    children: [
      { label: "Part-Time Jobs", route: "/jobs/part-time" },
      { label: "Full-Time Jobs", route: "/jobs/full-time" },
      { label: "Applications", route: "/jobs/applications" },
    ],
  },
  {
    label: "Marketplace",
    icon: ShoppingBag,
    children: [
      { label: "All Listings", route: "/marketplace/listings" },
      { label: "Featured Listings", route: "/marketplace/featured" },
    ],
  },
  {
    label: "Shops",
    icon: Store,
    children: [
      { label: "All Shops", route: "/shops/all" },
      { label: "Lite Subscriptions", route: "/shops/lite" },
      { label: "Pro+ Subscriptions", route: "/shops/pro" },
      { label: "Shop Analytics", route: "/shops/analytics" },
    ],
  },
  {
    label: "Credits",
    icon: Coins,
    children: [
      { label: "Credits Dashboard", route: "/credits/dashboard" },
      { label: "Credits History", route: "/credits/history" },
      { label: "Coupons & Pricing", route: "/credits/coupons" },
    ],
  },
  {
    label: "Payments & Subscriptions",
    icon: CreditCard,
    children: [
      { label: "Transactions", route: "/payments/transactions" },
      { label: "Revenue Analytics", route: "/payments/revenue" },
    ],
  },
  {
    label: "Safety",
    icon: Shield,
    children: [
      { label: "SOS Alerts", route: "/safety/sos" },
      { label: "Blood Requests", route: "/safety/blood" },
    ],
  },
  {
    label: "Reports & Analytics",
    icon: BarChart,
    children: [
      { label: "Daily Reports", route: "/reports/daily" },
      { label: "Export Reports", route: "/reports/export" },
    ],
  },
  {
    label: "Categories",
    icon: Layers,
    children: [
      { label: "Categories", route: "/categories/main" },
      { label: "Subcategories", route: "/categories/sub" },
    ],
  },
  {
    label: "Content Moderation",
    icon: AlertTriangle,
    children: [
      { label: "Reported Posts", route: "/moderation/reports" },
      { label: "Blocked Users", route: "/moderation/blocked" },
    ],
  },
  {
    label: "Push Notifications",
    icon: Bell,
    children: [
      { label: "Send Notification", route: "/notifications/send" },
      { label: "Scheduled Notifications", route: "/notifications/scheduled" },
    ],
  },
  {
    label: "Home Banners",
    icon: Image,
    children: [
      { label: "Banner List", route: "/banners/list" },
      { label: "Add Banner", route: "/banners/add" },
    ],
  },
  {
    label: "Support & Help",
    icon: HelpCircle,
    children: [
      { label: "Support Tickets", route: "/support/tickets" },
      { label: "Resolved Tickets", route: "/support/resolved" },
    ],
  },
  {
    label: "Activity Tracker",
    icon: Activity,
    children: [
      { label: "Platform Activity", route: "/activity/platform" },
      { label: "User Activity", route: "/activity/users" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    route: "/settings",
  },
  
];

export default function Sidebar({ sidebarOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  // Auto-open parent menu if child route is active
  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => child.route === location.pathname
        );
        if (isChildActive) {
          setOpenMenu(index);
        }
      }
    });
  }, [location.pathname]);

  const isMenuItemActive = (route) => {
    return location.pathname === route;
  };

  const isParentActive = (children) => {
    return children?.some((child) => child.route === location.pathname);
  };

  const handleMenuClick = (item, index) => {
    if (item.children) {
      setOpenMenu(openMenu === index ? null : index);
    } else {
      navigate(item.route);
      closeSidebar();
    }
  };

  const handleSubMenuClick = (route) => {
    navigate(route);
    closeSidebar();
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)]
        bg-white border-r shadow-lg p-4 overflow-y-auto
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        scrollbar-hide`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = isMenuItemActive(item.route);
            const isParentMenuActive = isParentActive(item.children);

            return (
              <div key={index}>
                <div
                  onClick={() => handleMenuClick(item, index)}
                  className={`flex items-center justify-between p-3 rounded-xl
                  cursor-pointer transition-colors duration-200
                  ${
                    isActive || isParentMenuActive
                      ? "bg-orange-100 text-[#FE702E]"
                      : "text-gray-700 hover:bg-orange-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.children && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        openMenu === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {item.children && openMenu === index && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((sub, i) => {
                      const isSubActive = isMenuItemActive(sub.route);

                      return (
                        <div
                          key={i}
                          onClick={() => handleSubMenuClick(sub.route)}
                          className={`text-sm p-2 rounded-lg cursor-pointer transition-colors duration-200
                          ${
                            isSubActive
                              ? "bg-orange-100 text-[#FE702E] font-medium"
                              : "text-gray-600 hover:text-[#FE702E] hover:bg-orange-50"
                          }`}
                        >
                          {sub.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}