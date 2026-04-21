import { NavLink } from "react-router-dom";
import Input from "./Input";

function MobileMenu({ setIsOpen, isOpen }) {
  return (
    <aside
      className={`sm:hidden flex flex-col fixed top-10 right-0 h-full w-64 bg-background shadow-lg transform transition-transform duration-300 z-50 p-2  ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <Input />
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
