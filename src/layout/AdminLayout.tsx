import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../component/admin/AdminSideNav";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col bg-gray-100 overflow-y-auto relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden absolute top-4 right-4 z-30 text-2xl text-gray-800 bg-white p-2 rounded-full shadow-md"
          >
            <FaBars />
          </button>
          <div className="px-0 lg:px-6 lg:py-3 mt-0 lg:mt-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
