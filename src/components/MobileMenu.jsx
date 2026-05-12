import { NavLink } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { XMarkIcon } from "@heroicons/react/16/solid";

function MobileMenu({ setIsOpen, isOpen }) {
  return (
    <aside
      className={`sm:hidden flex flex-col fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 z-50 p-4 pt-10 gap-2 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between">
        <Input />
        <Button onClick={() => setIsOpen(false)}>
          <XMarkIcon className="w-6" />
        </Button>
      </div>
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
        className="hover:opacity-80"
      >
        Booking
      </NavLink>
    </aside>
  );
}

export default MobileMenu;
