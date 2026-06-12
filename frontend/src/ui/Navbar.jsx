import { useLocation, NavLink } from "react-router-dom";
import { ShoppingCartIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Button from "./Button";
import MobileMenu from "../../public/MobileMenu";
import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/AuthContext";
import UserDropdown from "../features/auth/UserDropdown";
import { useCart } from "../features/cart/CartContext";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isHome && !scrolled
            ? "absolute top-0 left-0 bg-transparent text-white"
            : "sticky top-0 bg-white shadow-sm text-black"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <div className="sm:hidden shrink-0">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 text-current hover:opacity-70 transition"
                aria-label="Open Menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
            <NavLink
              to="/"
              className="font-extrabold text-xl whitespace-nowrap"
            >
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
              <span>({totalItems})</span>
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
        </div>
      </nav>
      <MobileMenu setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
}

export default Navbar;
