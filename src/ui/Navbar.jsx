import { NavLink, useLocation } from "react-router-dom";
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

function Navbar() {
  const isLogin = false;
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = location.pathname === "/";

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
        <div className="flex items-center gap-2 min-w-0">
          {/* Input (only md and above) */}
          <div className="hidden md:block min-w-0">
            <Input />
          </div>

          {/* User */}
          <NavLink to={isLogin ? "/profile" : "/login"}>
            <UserIcon className="w-6 shrink-0" />
          </NavLink>

          {/* Cart */}
          <NavLink to="/cart">
            <ShoppingCartIcon className="w-6 shrink-0" />
          </NavLink>

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
