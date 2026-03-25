import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Icon from "../Icons/Icon";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
  { name: "Category (உள்ளாட்சி அமைப்பு)", path: "/admin/category", icon: "Building2" },
  {
    name: "Part No (பாகம் எண்)",
    path: "/admin/part",
    icon: "FileText",
  },
  { name: "Ward (வார்டு)", path: "/admin/ward", icon: "Warehouse" },
  { name: "Area (நகர்)", path: "/admin/area", icon: "LandPlot" },
  { name: "Voter (வாக்காளர்)", path: "/admin/voter", icon: "User" },
  { name: "User", path: "/admin/user", icon: "Users" },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const closeSidebar = () => setIsOpen(false);

  // Redirect handling
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/admin" || currentPath === "/admin/") {
      navigate("/admin/dashboard", { replace: true }); 
    }
    const validAdminPaths = navItems.map((item) => item.path);
    if (
      currentPath.startsWith("/admin") &&
      !validAdminPaths.includes(currentPath)
    ) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Esc key support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("wishlistUpdated"));

    closeSidebar();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-0
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950`}
      >
        {/* Background animations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Header */}
        <div className="relative h-20 flex items-center justify-between px-6 flex-shrink-0 border-b border-slate-800/80">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/home")}
              className="group p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 border border-transparent hover:border-white/20"
            >
              <ChevronLeft className="text-gray-300 group-hover:text-white transition-colors" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  Admin
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Control Panel
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white text-xl p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:rotate-90 active:scale-95 border border-transparent hover:border-white/20"
          >
            <Icon name="X" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              style={{ animationDelay: `${index * 50}ms` }}
              className={({ isActive }) =>
                `group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 animate-fadeIn ${
                  isActive
                    ? "bg-gray-500 text-white font-semibold shadow-lg shadow-gray-500/30"
                    : "hover:bg-white/5 text-gray-300 hover:text-white hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/50"></div>
                  )}
                  <div
                    className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 shadow-inner"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon name={item.icon as any} className="w-5 h-5" />
                  </div>
                  <span className="font-medium flex-1">{item.name}</span>
                  {isActive && (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse delay-100"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse delay-200"></div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="relative px-3 py-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 transition-all duration-300 gap-3 group border border-red-500/20 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-white/20 transition-all duration-300">
              <BiLogOut size={20} />
            </div>
            <span className="font-semibold">Logout</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
