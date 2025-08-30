// components/Sidebar.jsx (fixed version)
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileText, 
  FolderOpen, 
  Activity, 
  CreditCard, 
  Settings, 
  X, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Building2,
  Home
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/Dashboard",
      icon: Home,
      description: "Overview",
    },
    {
      name: "Returns",
      href: "/Returns",
      icon: FileText,
      description: "Manage tax returns",
    },
    {
      name: "Documents",
      href: "/Documents",
      icon: FolderOpen,
      description: "Document library",
    },
    {
      name: "Activity Logs",
      href: "/ActivityLogs",
      icon: Activity,
      description: "View activity history",
    },
    {
      name: "Payments",
      href: "/Payments",
      icon: CreditCard,
      description: "Invoices & payments",
    },
    {
      name: "Settings",
      href: "/Settings",
      icon: Settings,
      description: "Account settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitials = () => {
    if (typeof window !== 'undefined') {
      const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      if (profile.firstName && profile.lastName) {
        return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
      }
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const getUserName = () => {
    if (typeof window !== 'undefined') {
      const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      if (profile.firstName && profile.lastName) {
        return `${profile.firstName} ${profile.lastName}`;
      }
    }
    return user?.email || "User";
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
          width: isCollapsed ? 80 : 320,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 z-50 h-full bg-gray-900 text-white border-r border-gray-800 shadow-xl lg:relative lg:translate-x-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-80"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white">Taxation Dashboard</h1>
                  <p className="text-xs text-gray-400">Tax Management System</p>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              {/* Collapse toggle (desktop only) */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex h-8 w-8 p-0 text-white hover:bg-gray-800 rounded-md items-center justify-center"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {/* Close button (mobile only) */}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden h-8 w-8 p-0 text-white hover:bg-gray-800 rounded-md items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg border border-blue-500"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : ""}`} />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p
                          className={`text-xs ${isActive ? "text-blue-100" : "text-gray-400"}`}
                        >
                          {item.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-800">
            <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium ring-2 ring-blue-500">
                {getUserInitials()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">{getUserName()}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="w-full mt-3 py-2 px-3 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-md text-left flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;