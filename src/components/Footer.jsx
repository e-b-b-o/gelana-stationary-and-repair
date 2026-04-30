import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <section className="bg-primary/10 p-6 rounded-t-2xl space-y-3 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  items-start md:items-center">
        <div className="p-6">
          <NavLink to="/" className="font-extrabold text-xl">
            GelanaTech
          </NavLink>
          <p className="text-muted text-sm md:text-base">
            Your trusted store for stationery, laptop parts, and repair
            services.
          </p>
        </div>
        <div className="space-x-3 p-6">
          <h3 className="text-lg font-semibold">Navigate</h3>
          <div className="flex flex-col text-sm text-muted">
            <NavLink to="/" className="hover:opacity-70 inline">
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
        <div className="space-x-3 md:p-3 p-6">
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="flex flex-col text-sm text-muted md:text-base">
            <p>
              Phone Number : <span className="font-semibold">0911772873</span>
            </p>
            <p>
              Email :<span className="font-semibold">Gelanatech@gmail.com</span>
            </p>
            <p>
              Location :
              <span className="font-semibold">
                Fitche , Infront of Wegagen Bank
              </span>
            </p>
          </div>
        </div>
        <div className="space-x-3 p-6">
          <h3 className="text-lg font-semibold">Services</h3>
          <div className="flex flex-col text-sm text-muted md:text-base">
            <p>Stationery</p>
            <p>Laptop Parts</p>
            <p>Repair</p>
          </div>
        </div>
      </div>
      <div className="text-muted text-sm md:text-base border-t pt-6 text-center">
        © 2026 GelanaTech. All rights reserved.
      </div>
    </section>
  );
}

export default Footer;
