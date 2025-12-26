import { Bell, LogOut, Users } from "lucide-react";
import React, { useState } from "react";
import adminImg from "../assets/doctor.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import useAdminProfile from "@/hooks/admin";

const DashboardHeader = () => {
  const { profile, handleLogout } = useAdminProfile();



  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left placeholder (logo or menu if needed) */}
          <div className="flex items-center">
            {/* <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
              Dashboard
            </h1> */}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm flex items-center justify-center"
            >
              {/* Bell Icon */}
              <Bell className="h-6 w-6 text-gray-700" />

              {/* Unread Notification Dot */}
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <button className="flex items-center gap-3 group focus:outline-none transition-all">
                    {/* Profile Image */}
                    <div className="relative w-14 h-14  overflow-hidden  p-[2px] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <div className="w-full h-full  bg-white overflow-hidden">
                        <img
                          src={adminImg}
                          alt="User"
                          className="w-full h-full object-cover  group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Online Status Dot */}
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Welcome ,</p>
                      <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                        {profile?.name || "Admin User"}
                      </p>
                    </div>
                  </button>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm"
              >
                {/* Profile Link */}
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/dashboard/Profile")}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gradient-to-r hover:from-[#155DFC]/10 hover:to-[#0092B8]/10 hover:text-blue-700 rounded-md transition-all px-4 py-2"
                >
                  <Users className="h-4 w-4 text-[#155DFC]" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 rounded-md transition-all px-4 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
