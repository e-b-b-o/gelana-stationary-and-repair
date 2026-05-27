import { useLocation, NavLink } from "react-router-dom";
import { ShoppingCartIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import UserDropdown from "../features/auth/UserDropdown";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = location.pathname === "/";
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/5 z-40"
        />
      )}

      <nav
        className={`w-full z-50 sm:px-20 sm:py-8 px-6 py-6 flex justify-between items-center ${isHome
          ? "absolute top-0 left-0 bg-transparent text-white"
          : "sticky top-0 bg-white shadow-sm text-black"
          }`}
      >
        {/* LEFT */}
        <div className="flex space-x-2  min-w-0">
          {/* Hamburger — mobile only */}
          <div className="sm:hidden shrink-0">
            <Button onClick={() => setIsOpen(true)}>
              <Bars3Icon className="w-6" />
            </Button>
          </div>
          <NavLink to="/" className="font-extrabold text-xl whitespace-nowrap">
            GelanaTech
          </NavLink>
        </div>

        {/* DESKTOP LINKS */}
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

        {/* RIGHT */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Cart */}
          <NavLink to="/cart" className="flex items-center gap-0.5">
            <ShoppingCartIcon className="w-6 shrink-0 inline-block" />
            <span>(0)</span>
          </NavLink>

          {/* User avatar with dropdown */}
          {isAuthenticated ? (
            <UserDropdown
              avatarSrc="https://i.pravatar.cc/150"
              userName="Ebisa Getachew"
              userInitial="E"
            />
          ) : (
            <div className="hidden sm:flex">
              <Button
                to="/login"
                variant="primary"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Button>
            </div>
          )}


        </div>
      </nav>
      <MobileMenu setIsOpen={setIsOpen} isOpen={isOpen} />

    </>
  );
}

export default Navbar;
