import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../auth/AuthContext";
import Button from "../../ui/Button";

const navigation = [
  { name: "Dashboard", to: "/admin", end: true, icon: Squares2X2Icon },
  { name: "Products", to: "/admin/products", icon: CubeIcon },
  { name: "Categories", to: "/admin/categories", icon: TagIcon },
  { name: "Orders", to: "/admin/orders", icon: ShoppingBagIcon },
  { name: "Customers", to: "/admin/users", icon: UsersIcon },
  { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-primary">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-extrabold tracking-tight">
            Gelana Admin
          </span>
        </div>

        {/* User Info Section (Inspired by screenshot) */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {user?.first_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Menu
          </p>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {/* Breadcrumb could go here, keeping it simple for now */}
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-primary capitalize">
              {window.location.pathname.split("/").pop() || "Dashboard"}
            </span>
          </div>
          <Button variants="primary" size="sm" to="/">
            User Page
          </Button>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
