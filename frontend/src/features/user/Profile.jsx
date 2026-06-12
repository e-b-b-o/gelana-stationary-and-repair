import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { useAuth } from "../auth/AuthContext";
import { useOrder } from "../order/OrderContext";
import { useWishlist } from "../wishlist/WishlistContext";
import {
  ShoppingBagIcon,
  HeartIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { SkeletonProfileCard, SkeletonStatCard } from "../../ui/Skeleton";

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</p>
    <p className="font-medium text-primary mt-1">{value || <span className="text-gray-300 italic">Not set</span>}</p>
  </div>
);

function Profile() {
  const { user, logout } = useAuth();
  const { orders } = useOrder();
  const { wishlistItems } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Read real booking count from localStorage
  const bookingKey = user ? `bookings_${user.id}` : "bookings";
  const bookings = JSON.parse(localStorage.getItem(bookingKey) || "[]");

  const joinYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "—";

  const initials = user?.fullname
    ? user.fullname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 animate-fade-in-up">
        <div className="space-y-2">
          <div className="w-40 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <SkeletonProfileCard />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <SkeletonProfileCard />
        <SkeletonProfileCard />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 animate-fade-in-up">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">My Account</h1>
        <p className="mt-1 text-muted text-sm">Manage your profile, orders and bookings.</p>
      </div>

      {/* PROFILE HERO */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-primary">{user?.fullname || "No Name Set"}</h2>
              <p className="text-muted text-sm mt-0.5">{user?.email}</p>
              <p className="text-xs text-muted mt-1">Member since {joinYear}</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="primary" size="sm" to="/editprofile">
              <PencilSquareIcon className="w-4 h-4 mr-1.5 inline" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* REAL STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
          <ShoppingBagIcon className="w-7 h-7 mx-auto mb-2 text-primary" />
          <h3 className="text-2xl font-extrabold text-primary">{orders?.length ?? 0}</h3>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mt-1">Orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
          <HeartIcon className="w-7 h-7 mx-auto mb-2 text-primary" />
          <h3 className="text-2xl font-extrabold text-primary">{wishlistItems?.length ?? 0}</h3>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mt-1">Wishlist</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
          <CalendarDaysIcon className="w-7 h-7 mx-auto mb-2 text-primary" />
          <h3 className="text-2xl font-extrabold text-primary">{bookings.length}</h3>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mt-1">Bookings</p>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-primary">Personal Information</h3>
            <p className="text-muted text-sm mt-0.5">Basic details linked to your account.</p>
          </div>
          <Button variant="outline" size="sm" to="/editprofile">Edit</Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <InfoRow label="Full Name" value={user?.fullname} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Phone" value={user?.phone} />
          <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null} />
        </div>
      </div>

      {/* ADDRESS INFO */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-primary">Address Information</h3>
            <p className="text-muted text-sm mt-0.5">Used for deliveries and billing.</p>
          </div>
          <Button variant="outline" size="sm" to="/editprofile">Edit</Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <InfoRow label="Country" value={user?.country} />
          <InfoRow label="City" value={user?.city} />
          <InfoRow label="Address" value={user?.address} />
          <InfoRow label="Postal Code" value={user?.postalCode} />
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      {bookings.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-primary mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(-3).reverse().map((b) => (
              <div key={b.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-primary">{b.laptopBrand} — {b.serviceType}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {b.preferredDate} · Booked {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 shrink-0">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCOUNT ACTIONS */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-primary mb-4">Account Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="md" to="/editprofile">
            Change Password
          </Button>
          <Button variant="primary" size="md" onClick={logout}>
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1.5 inline" />
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Profile;
