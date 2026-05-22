import { useLocation, NavLink } from "react-router-dom";
import Input from "./Input";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = location.pathname === "/";
  const { isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/5 z-40"
        />
      )}

      <nav
        className={`w-full z-50 sm:px-20 sm:py-8 px-6 py-6 flex justify-between  ${isHome ? "absolute top-0 left-0 bg-transparent text-white" : "sticky top-0 bg-white shadow-sm text-black"}`}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <NavLink to="/" className="font-extrabold text-xl whitespace-nowrap">
            GelanaTech
          </NavLink>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-5 whitespace-nowrap">
          <NavLink to="/" className="hover:opacity-70">
            Home
          </NavLink>
          <NavLink to="/products" className="hover:opacity-80">
            Products
          </NavLink>
          <NavLink to="/booking" className="hover:opacity-80">
            Booking
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Cart */}

          <NavLink to="/cart">
            <ShoppingCartIcon className="w-6 shrink-0 inline-block" />
            <span>(0)</span>
          </NavLink>

          {isAuthenticated && (
            <Button onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="rounded-full object-cover sm:w-8 sm:h-8 w-6 h-6 border border-primary/20"
              />
            </Button>
          )}

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex space-x-2">
              <Button to="/login" size="sm">
                Log in
              </Button>

              <Button to="/signup" variant="primary" size="sm">
                Register
              </Button>
            </div>
          )}

          {/* Hamburger */}
          <div className="sm:hidden shrink-0">
            <Button onClick={() => setIsOpen(true)}>
              <Bars3Icon className="w-6" />
            </Button>
          </div>
        </div>
      </nav>

      <MobileMenu setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
}

export default Navbar;
