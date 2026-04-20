import { NavLink } from "react-router-dom";
import Input from "./Input";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

function Navbar() {
  const isLogin = false;
  return (
    <nav className="flex justify-between items-center gap-6">
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

      {isLogin ? (
        <div className="gap-2 sm:gap-4 flex justify-center items-center min-w-0 ">
          <Input />
          <NavLink to="/cart">
            <ShoppingCartIcon className="w-6" />
          </NavLink>
          <NavLink to="/profile">
            <UserIcon className="w-6" />
          </NavLink>
        </div>
      ) : (
        <div className="space-x-2 min-w-0 flex">
          <Input />
          <Button>Login</Button>
          <Button>Sign up</Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
