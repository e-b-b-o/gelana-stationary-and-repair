import { NavLink } from "react-router-dom";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/5 z-40"
        />
      )}

      <nav className="flex justify-between items-center gap-3 overflow-hidden sm:mb-3 max-w-7xl mx-auto px-4 pt-2 sm:pt-3 ">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <NavLink to="/" className="font-extrabold text-xl whitespace-nowrap">
            GelanaTech
          </NavLink>

          {/* Desktop links */}
          <div className="hidden sm:flex gap-5 whitespace-nowrap text-primary/70">
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
            {isOpen ? (
              <Button onClick={() => setIsOpen(false)}>
                <XMarkIcon className="w-6" />
              </Button>
            ) : (
              <Button onClick={() => setIsOpen(true)}>
                <Bars3Icon className="w-6" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      <MobileMenu setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
}

export default Navbar;
