import Input from "../../ui/Input";

function BookingForm() {
  return (
    <form className="max-w-2xl mx-auto">
      <div className="bg-white p-4">
        <div>
          <h2 className="font-semibold text-xl">Contact Details</h2>
          <div>
            <label htmlFor="first-name">First Name</label>
            <Input />
            <label htmlFor="last-name">Last Name</label>
            <Input />
          </div>
          <div>
            <label htmlFor="phone-no">Phone Number</label>
            <Input />
            <label htmlFor="email">Email</label>
            <Input />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-xl"> Booking Details</h2>
          <div>
            <label htmlFor="date">Date</label>
            <Input />
            <label htmlFor="service-type">Service Type</label>
            <Input />
          </div>
          <div>
            <label htmlFor="laptop-brand">Laptop Brand</label>
            <Input />
            <label htmlFor="device-type">Device Type</label>
            <Input />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-xl">Problem Description</h2>
          <div></div>
        </div>
      </div>
    </form>
  );
}

export default BookingForm;
