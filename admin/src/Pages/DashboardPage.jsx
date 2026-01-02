"use client";

import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import DashboardHeader from "@/own_components/DashboardHeader";
import useAdminProfile from "@/hooks/admin";
import ProtectedRoute from "@/lib/ProtectedRoute";

// Pages
import DashboardHome from "./DashboardHome";
import AddNewTreatMents from "./services/AddNewTreatMents";
import AllSessions from "./sessions/AllSessions";
import SessionDetails from "./sessions/SessionDetails";
import AllUsers from "./users/AllUsers";
import AllServices from "./services/AllServices";
import AllBlogCategories from "./Blogs/blogs-categories/AllBlogCategories";
import AllDoctors from "./users/AllDoctors";
import AllNotifications from "./Notifications/AllNotifications";
import AllClinic from "./clinic/AllClinic";
import BlogManagement from "./Blogs/Blog/AllBlogs";
import AdminProfile from "./users/AdminProfile";
import ConfigSettings from "./settings/ConfigSettings";

// Icons
import {
  Stethoscope,
  Menu,
  ChevronDown,
  ChevronRight,
  Circle,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";

// Menu Sections
import { menuSections, ADMIN_WEB_NAME } from "@/context/ui.constant";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAdminProfile();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const handleNavigation = (path) => navigate(path);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header - always fixed */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-sky-700 z-20">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center shadow-md">
            <Stethoscope className="w-6 h-6 text-[#155DFC]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{ADMIN_WEB_NAME}</h1>
            <p className="text-xs text-white/80 whitespace-nowrap">Physiotherapist | Osteopath | Chiropractor</p>
          </div>
        </div>

        {/* Menu - scrollable */}
        <ScrollArea className="flex-1 overflow-y-auto py-5 px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <nav className="space-y-3">
            {menuSections.map((section, idx) => {
              const Icon = section.icon;
              const isExpanded = expandedSections[section.title];
              const isActiveSection = section.singleItem
                ? isActive(section.to)
                : section.items?.some((item) => isActive(item.to));

              // Single menu item
              if (section.singleItem) {
                return (
                  <button
                    key={idx}
                    onClick={() => handleNavigation(section.to)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActiveSection
                    ? "bg-gradient-to-r from-blue-800 to-sky-700 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-blue-800 hover:to-sky-700 hover:text-white"
                }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActiveSection ? "text-white" : "text-gray-400"
                      } transition-colors`}
                    />
                    <span className="text-sm font-semibold">
                      {section.label || section.title}
                    </span>
                  </button>
                );
              }

              // Collapsible menu
              return (
                <div key={idx}>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActiveSection
                    ? "bg-gradient-to-r from-blue-800 to-sky-700 text-white shadow-md"
                    : isExpanded
                    ? "bg-blue-800/10 text-[#155DFC] shadow-inner"
                    : "bg-gray-50 text-gray-700 hover:bg-gradient-to-r  hover:from-blue-800 hover:to-sky-700 hover:text-white"
                }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          isActiveSection ? "text-white" : "text-gray-400"
                        } transition-colors`}
                      />
                      <span className="text-sm font-semibold">
                        {section.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown
                        className={`w-4 h-4 ${
                          isActiveSection ? "text-white" : "text-[#155DFC]"
                        } transition-transform`}
                      />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                    )}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-60 mt-2" : "max-h-0"
                    }`}
                  >
                    <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                      {section.items?.map((item, itemIdx) => {
                        const isItemActive = isActive(item.to);
                        return (
                          <button
                            key={itemIdx}
                            onClick={() => handleNavigation(item.to)}
                            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-all duration-200
                        ${
                          isItemActive
                            ? "bg-gradient-to-r from-blue-800 to-sky-700 text-white shadow-sm"
                            : "bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-blue-800 hover: to-sky-700 hover:text-white hover:translate-x-1"
                        }`}
                          >
                            <Circle
                              className={`w-1.5 h-1.5 ${
                                isItemActive ? "fill-white" : "fill-gray-300"
                              }`}
                            />
                            <span className="flex-1">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer - fixed at bottom */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
        <div
          onClick={() => handleNavigation("/dashboard/profile")}
          className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#155DFC]/10 cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-800 to-sky-700 flex items-center justify-center text-white font-bold text-base ring-2 ring-white">
            {profile?.name?.charAt(0) || "D"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.name || "Dr. Rajneesh"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.email || "doctor@clinic.com"}
            </p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-[#155DFC] transition-all" />
        </div>

       <button
        onClick={() => console.log("Logout clicked")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md
                  bg-gradient-to-r from-blue-800 to-sky-700 text-white text-sm font-medium
                  hover:bg-gradient-to-r hover:from-blue-800 hover:to-sky-700 transition-all duration-200"
      >
        <LogOut className="w-4 h-4 text-white" />
        <span className="truncate">Logout</span>
      </button>

      </div>

      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-64 w-80">
        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-10 bg-white border-b">
          <DashboardHeader />
        </div>

        {/* Main Routes */}
        <main className="flex-1 bg-white p-4 md:p-6">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-or-update-treatments"
              element={
                <ProtectedRoute>
                  <AddNewTreatMents />
                </ProtectedRoute>
              }
            />

            {/* Sessions */}
            <Route
              path="/Sessions"
              element={
                <ProtectedRoute>
                  <AllSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Users"
              element={
                <ProtectedRoute>
                  <AllUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatments"
              element={
                <ProtectedRoute>
                  <AllServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs-categories"
              element={
                <ProtectedRoute>
                  <AllBlogCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-blogs"
              element={
                <ProtectedRoute>
                  <BlogManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute>
                  <AllDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sessions/:id"
              element={
                <ProtectedRoute>
                  <SessionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <AllNotifications />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

            <Route
                path="/web-settings"
                element={
                  <ProtectedRoute>
                    <ConfigSettings />
                  </ProtectedRoute>
                }
              />


            {/* All Users */}
            <Route path="/users" element={<AllUsers />} />
            <Route path="/all-clinic" element={<AllClinic />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
