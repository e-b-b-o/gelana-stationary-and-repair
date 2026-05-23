import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "./AuthContext";

function UserDropdown() {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef();

  // CLOSE WHEN CLICKING OUTSIDE
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* AVATAR BUTTON */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg hover:opacity-90 transition"
      >
        {user?.email?.charAt(0).toUpperCase() || "U"}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-72 bg-white border border-primary/10 shadow-xl z-50 overflow-hidden">
          {/* TOP USER INFO */}
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-b border-primary/10">
            <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-primary">
                {user?.email || "Guest User"}
              </h3>

              <p className="text-sm text-muted">Customer Account</p>
            </div>
          </div>

          {/* MENU ITEMS */}
          <div className="flex flex-col py-2">
            <NavLink
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition text-primary"
            >
              <UserCircleIcon className="w-5 h-5" />
              Profile
            </NavLink>

            <NavLink
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition text-primary"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Orders
            </NavLink>

            <NavLink
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition text-primary"
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
              Bookings
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition text-primary"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </NavLink>
          </div>

          {/* LOGOUT */}
          <div className="border-t border-primary/10">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition text-red-500"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
