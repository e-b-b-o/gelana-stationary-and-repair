import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useAuth } from "../auth/AuthContext";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Spinner from "../../ui/Spinner";

const LAPTOP_BRANDS = ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Apple", "Samsung", "MSI", "Other"];
const SERVICE_TYPES = [
  "Hardware Repair",
  "Software Repair",
  "Screen Replacement",
  "Cleaning & Maintenance",
  "Diagnosis",
  "Battery Replacement",
  "Keyboard Replacement",
];

function BookingForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    laptopBrand: "",
    serviceType: "",
    preferredDate: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.fullname.trim()) e.fullname = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.laptopBrand) e.laptopBrand = "Please select a laptop brand";
    if (!form.serviceType) e.serviceType = "Please select a service type";
    if (!form.preferredDate) e.preferredDate = "Please choose a preferred date";
    if (!form.description.trim()) e.description = "Please describe the issue";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    // Simulate brief API delay
    await new Promise((res) => setTimeout(res, 800));

    const newBooking = {
      id: crypto.randomUUID(),
      ...form,
      userId: user?.id || "guest",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Persist to localStorage, scoped by user ID
    const bookingKey = user ? `bookings_${user.id}` : "bookings";
    const existing = JSON.parse(localStorage.getItem(bookingKey) || "[]");
    existing.push(newBooking);
    localStorage.setItem(bookingKey, JSON.stringify(existing));

    setBooking(newBooking);
    setIsSuccess(true);
    setIsLoading(false);
  }

  // SUCCESS STATE
  if (isSuccess && booking) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 space-y-6">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-primary">Booking Confirmed!</h2>
          <p className="text-muted">
            Your repair request has been received. Our team will contact you shortly.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-left space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Name</p>
              <p className="font-semibold text-primary mt-0.5">{booking.fullname}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Phone</p>
              <p className="font-semibold text-primary mt-0.5">{booking.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Device</p>
              <p className="font-semibold text-primary mt-0.5">{booking.laptopBrand}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Service</p>
              <p className="font-semibold text-primary mt-0.5">{booking.serviceType}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Preferred Date</p>
              <p className="font-semibold text-primary mt-0.5">{booking.preferredDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Status</p>
              <span className="inline-block text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700 rounded-full px-2.5 py-1 mt-0.5">
                {booking.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button to="/profile" variant="outline" size="md">
            View in Profile
          </Button>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setForm({ fullname: user?.fullname || "", phone: user?.phone || "", laptopBrand: "", serviceType: "", preferredDate: "", description: "" });
              setBooking(null);
            }}
            variant="primary"
            size="md"
          >
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  const fieldClass = (name) =>
    `w-full h-12 border px-4 outline-none transition-all rounded-md text-sm bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
      {/* LEFT: FORM */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 sm:p-8 space-y-7">
        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          {/* PERSONAL INFO */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Personal Information</h2>
              <p className="text-sm text-muted mt-0.5">Enter your contact details</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Gelana Techan" className={fieldClass("fullname")} />
                {errors.fullname && <p className="text-xs text-red-500 font-medium">{errors.fullname}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+251 9XXXXXXXX" className={fieldClass("phone")} />
                {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* DEVICE INFO */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Device Information</h2>
              <p className="text-sm text-muted mt-0.5">Help us understand your device</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Laptop Brand</label>
                <select name="laptopBrand" value={form.laptopBrand} onChange={handleChange} className={fieldClass("laptopBrand")}>
                  <option value="">Select brand</option>
                  {LAPTOP_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.laptopBrand && <p className="text-xs text-red-500 font-medium">{errors.laptopBrand}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Service Type</label>
                <select name="serviceType" value={form.serviceType} onChange={handleChange} className={fieldClass("serviceType")}>
                  <option value="">Select service</option>
                  {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.serviceType && <p className="text-xs text-red-500 font-medium">{errors.serviceType}</p>}
              </div>
            </div>
          </section>

          {/* BOOKING DETAILS */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Booking Details</h2>
              <p className="text-sm text-muted mt-0.5">Choose your preferred appointment date</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Preferred Date</label>
              <input
                type="date"
                name="preferredDate"
                value={form.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={fieldClass("preferredDate")}
              />
              {errors.preferredDate && <p className="text-xs text-red-500 font-medium">{errors.preferredDate}</p>}
            </div>
          </section>

          {/* PROBLEM DESCRIPTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Problem Description</h2>
              <p className="text-sm text-muted mt-0.5">Describe the issue you're experiencing</p>
            </div>
            <div className="space-y-1.5">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="My laptop is overheating and shutting down after a few minutes..."
                className={`w-full border px-4 py-3 outline-none resize-none rounded-md text-sm bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
            </div>
          </section>

          <Button variant="primary" size="lg" className="w-full justify-center flex items-center gap-2" type="submit" disabled={isLoading}>
            {isLoading && <Spinner size="sm" />}
            {isLoading ? "Submitting…" : "Book Repair Service"}
          </Button>
        </form>
      </div>

      {/* RIGHT: INFO PANEL */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <img
            src="/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png"
            alt="Repair Service"
            className="h-56 w-full object-cover"
          />
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <WrenchScrewdriverIcon className="w-6 h-6 text-primary shrink-0" />
              <h2 className="text-lg font-bold text-primary">Professional Repair</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Reliable repair service for hardware and software problems. Fast turnaround, experienced technicians, and affordable pricing.
            </p>
            <div className="space-y-2 text-sm">
              {SERVICE_TYPES.slice(0, 4).map((s) => (
                <div key={s} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-muted">{s}</span>
                  <span className="font-semibold text-green-600 text-xs">Available</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
