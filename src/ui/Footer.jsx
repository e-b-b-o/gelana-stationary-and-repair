import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">GelanaTech</h2>
            <p className="text-sm text-muted">
              Your trusted store for stationery, laptop parts, and repair
              services.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Navigate</h3>

            <div className="flex flex-col gap-2 text-sm text-muted">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/booking">Booking</NavLink>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Services</h3>

            <div className="flex flex-col gap-2 text-sm text-muted">
              <p>Stationery</p>
              <p>Laptop Parts</p>
              <p>Repair Services</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contact</h3>

            <div className="flex flex-col gap-2 text-sm text-muted">
              <p>Addis Ababa, Ethiopia</p>
              <p>+251 911592818</p>
              <p>support@gelanatech.com</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted">
          <p>© 2026 GelanaTech. All rights reserved.</p>

          <div className="flex gap-4">
            <p>Privacy</p>
            <p>Terms</p>
            <p>Contact</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
