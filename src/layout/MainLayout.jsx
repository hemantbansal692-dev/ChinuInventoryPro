import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <Outlet /> {/* 🔥 THIS FIXES EVERYTHING */}
        </div>

      </div>
    </div>
  );
}