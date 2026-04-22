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
      <nav className="flex justify-between items-center gap-3 sm:mb-5">
        <div className="flex sm:gap-8 items-center">
          <NavLink to="/" className="font-extrabold text-xl">
            GelanaTech
          </NavLink>
          <div className="space-x-5 sm:block hidden">
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

        <div className="flex space-x-2">
          <span className="hidden sm:block">
            <Input />
          </span>
          {isLogin ? (
            <div>
              <NavLink to="/profile">
                <UserIcon className="w-6" />
              </NavLink>
            </div>
          ) : (
            <div>
              <NavLink to="/login">
                <UserIcon className="w-6" />
              </NavLink>
            </div>
          )}
          <NavLink to="/cart">
            <ShoppingCartIcon className="w-6" />
          </NavLink>
          <div className="sm:hidden">
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
