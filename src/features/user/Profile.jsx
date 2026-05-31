import Button from "../../ui/Button";
import { useAuth } from "../auth/AuthContext";
import {
  ShoppingBagIcon,
  HeartIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20 space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          My Account
        </h1>

        <p className="mt-2 text-muted">
          Manage your profile, orders, bookings and preferences.
        </p>
      </div>
      {/* PROFILE HERO */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-8">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
            />

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {user?.fullname || "Guest User"}
              </h2>

              <p className="text-muted mt-1">{user?.email}</p>

              <p className="text-sm text-muted mt-2">Customer since 2026</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>

            <Button variant="primary" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      {/* ACCOUNT STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-6 text-center">
          <ShoppingBagIcon className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">12</h3>
          <p className="text-sm text-muted">Orders</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 text-center">
          <HeartIcon className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">8</h3>
          <p className="text-sm text-muted">Wishlist</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 text-center">
          <CalendarDaysIcon className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">3</h3>
          <p className="text-sm text-muted">Bookings</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 text-center">
          <StarIcon className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">2</h3>
          <p className="text-sm text-muted">Reviews</p>
        </div>
      </div>
      {/* PERSONAL INFO */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold">Personal Information</h3>

            <p className="text-muted text-sm mt-1">
              Basic information linked to your account.
            </p>
          </div>

          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <p className="text-muted text-sm">Full Name</p>
            <p className="font-medium mt-1">{user?.fullname}</p>
          </div>

          <div>
            <p className="text-muted text-sm">Email</p>
            <p className="font-medium mt-1">{user?.email}</p>
          </div>

          <div>
            <p className="text-muted text-sm">Phone</p>
            <p className="font-medium mt-1">Not Added</p>
          </div>

          <div>
            <p className="text-muted text-sm">Account ID</p>
            <p className="font-medium mt-1">{user?.id}</p>
          </div>
        </div>
      </div>
      {/* ADDRESS */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold">Address Information</h3>

            <p className="text-muted text-sm mt-1">
              Used for deliveries and billing.
            </p>
          </div>

          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <p className="text-muted text-sm">Country</p>
            <p className="font-medium mt-1">Ethiopia</p>
          </div>

          <div>
            <p className="text-muted text-sm">City</p>
            <p className="font-medium mt-1">Addis Ababa</p>
          </div>

          <div>
            <p className="text-muted text-sm">Postal Code</p>
            <p className="font-medium mt-1">1000</p>
          </div>

          <div>
            <p className="text-muted text-sm">Address</p>
            <p className="font-medium mt-1">Not Added</p>
          </div>
        </div>
      </div>
      {/* ACCOUNT ACTIONS */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-8">
        <h3 className="text-2xl font-bold mb-6">Account Actions</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline">Change Password</Button>

          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
