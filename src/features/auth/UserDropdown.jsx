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
        className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg hover:opacity-90 transition"
      >
        {user?.email?.charAt(0).toUpperCase() || "U"}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <>
          {/* Mobile backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/25 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown panel */}
          <div
            className={[
              // Mobile: fixed, centered on viewport, full-width with margin
              "fixed left-0 right-5 top-18 z-50",
              // Desktop: absolute, right-aligned below avatar, fixed width
              "sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:translate-y-0 sm:w-72",
              // Shared styles
              "bg-white rounded-sm sm:rounded-sm border border-primary/10 shadow-2xl overflow-hidden",
            ].join(" ")}
          >
            {/* TOP USER INFO */}
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-6 sm:py-5 border-b border-primary/10">
              <div className="h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl sm:text-xl font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold text-primary leading-tight">
                  {user?.email || "Guest User"}
                </h3>
                <p className="text-sm text-muted mt-0.5">Customer Account</p>
              </div>
            </div>

            {/* MENU ITEMS */}
            <div className="flex flex-col py-1">
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition text-primary text-sm"
              >
                <UserCircleIcon className="w-5 h-5" />
                Profile
              </NavLink>

              <NavLink
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition text-primary text-sm"
              >
                <ClipboardDocumentListIcon className="w-5 h-5" />
                Orders
              </NavLink>

              <NavLink
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition text-primary text-sm"
              >
                <WrenchScrewdriverIcon className="w-5 h-5" />
                Bookings
              </NavLink>
            </div>

            {/* LOGOUT */}
            <div className="border-t border-primary/10">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition text-red-500 text-sm"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDropdown;
