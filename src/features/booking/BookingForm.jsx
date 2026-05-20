// features/booking/Booking.jsx

import Button from "../../ui/Button";
import Input from "../../ui/Input";

function BookingForm() {
  return (
    <>
      {/* CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* LEFT SIDE */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 p-6 md:p-8 space-y-8">
          {/* PERSONAL INFO */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Personal Information
              </h2>

              <p className="text-sm text-muted mt-1">
                Enter your contact details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Full Name
                </label>

                <Input placeholder="Gelana Techan" variant="form" size="md" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Phone Number
                </label>

                <Input placeholder="+251 9XXXXXXXX" variant="form" size="md" />
              </div>
            </div>
          </div>

          {/* DEVICE INFO */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Device Information
              </h2>

              <p className="text-sm text-muted mt-1">
                Help us understand your device
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Laptop Brand
                </label>

                <select className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                  <option>Dell</option>
                  <option>HP</option>
                  <option>Lenovo</option>
                  <option>ASUS</option>
                  <option>Acer</option>
                  <option>Apple</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Service Type
                </label>

                <select className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                  <option>Hardware Repair</option>
                  <option>Software Repair</option>
                  <option>Screen Replacement</option>
                  <option>Cleaning & Maintenance</option>
                  <option>Diagnosis</option>
                </select>
              </div>
            </div>
          </div>

          {/* DATE */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Booking Details
              </h2>

              <p className="text-sm text-muted mt-1">
                Choose your preferred date
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Preferred Date
              </label>

              <Input type="date" variant="form" size="md" />
            </div>
          </div>

          {/* ISSUE */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Problem Description
              </h2>

              <p className="text-sm text-muted mt-1">
                Explain the issue you are facing
              </p>
            </div>

            <textarea
              rows="5"
              placeholder="My laptop is overheating and shutting down after a few minutes..."
              className="w-full rounded-2xl border border-gray-300 p-4 outline-none resize-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {/* BUTTON */}
          <Button variant="primary" size="lg" className="w-full justify-center">
            Book Repair
          </Button>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:block sticky top-24">
          <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden">
            <img
              src="/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png"
              alt="Repair Service"
              className="h-72 w-full object-cover"
            />

            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Professional Laptop Repair
                </h2>

                <p className="text-sm text-muted mt-3 leading-relaxed">
                  Reliable repair service for hardware and software problems.
                  Fast turnaround, experienced technicians, and affordable
                  pricing.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                  <span className="text-muted">Screen Replacement</span>
                  <span className="font-semibold text-primary">Available</span>
                </div>

                <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                  <span className="text-muted">Hardware Repair</span>
                  <span className="font-semibold text-primary">Available</span>
                </div>

                <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                  <span className="text-muted">Software Installation</span>
                  <span className="font-semibold text-primary">Available</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted">Maintenance</span>
                  <span className="font-semibold text-primary">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingForm;
