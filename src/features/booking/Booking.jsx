import BookingForm from "./BookingForm";

function Booking() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* HEADER */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
          Book a Repair Service
        </h1>

        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
          Tell us about your device and the issue you're facing. Our technicians
          will contact you shortly.
        </p>
      </div>
      {/* BOOKING */}
      <BookingForm />
    </section>
  );
}

export default Booking;
