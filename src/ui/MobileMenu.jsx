import { NavLink } from "react-router-dom";
import Input from "./Input";
import Button from "../ui/Button";
import { XMarkIcon } from "@heroicons/react/16/solid";

function MobileMenu({ setIsOpen, isOpen }) {
  return (
    <aside
      className={`sm:hidden flex flex-col fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 z-50  gap-2 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between bg-primary text-white p-6 w-full">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <NavLink to="/" className="font-extrabold text-xl whitespace-nowrap">
            GelanaTech
          </NavLink>
        </div>
        <NavLink onClick={() => setIsOpen(false)}>
          <XMarkIcon className="w-6" />
        </NavLink>
      </div>
      <div className="flex flex-col divide-y space-y-2 divide-black-100 mt-4 p-6 text-xl">
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className="hover:opacity-70"
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          onClick={() => setIsOpen(false)}
          className="hover:opacity-80"
        >
          Products
        </NavLink>
        <NavLink
          to="/booking"
          onClick={() => setIsOpen(false)}
          className="hover:opacity-80 border-b"
        >
          Booking
        </NavLink>
      </div>

      <div className="flex justify-between items-center gap-4 px-6 text-center mx-auto">
        <Button to="/login" variant="outline" size="md">
          Log in
        </Button>
        OR
        <Button to="/login" variant="primary" size="md">
          Sign up
        </Button>
      </div>
    </aside>
  );
}

export default MobileMenu;
