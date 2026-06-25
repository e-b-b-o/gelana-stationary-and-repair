import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useAuth } from "../features/auth/AuthContext";
import Button from "./Button";

function MobileMenu({ setIsOpen, isOpen }) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`sm:hidden flex flex-col fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 p-5 w-full">
          <NavLink
            to="/"
            className="font-extrabold text-xl text-primary whitespace-nowrap"
          >
            GelanaTech
          </NavLink>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:text-black transition rounded-full"
            aria-label="Close Menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col flex-1 py-6 px-5 space-y-4">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-lg font-bold text-gray-800 hover:text-primary transition-colors"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setIsOpen(false)}
            className="text-lg font-bold text-gray-800 hover:text-primary transition-colors"
          >
            Products
          </NavLink>
          <NavLink
            to="/booking"
            onClick={() => setIsOpen(false)}
            className="text-lg font-bold text-gray-800 hover:text-primary transition-colors"
          >
            Booking
          </NavLink>
        </div>

        {!isAuthenticated && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            <Button
              to="/login"
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </Button>
            <Button
              to="/signup"
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}

export default MobileMenu;
