import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    country: user?.country || "",
    city: user?.city || "",
    address: user?.address || "",
    postalCode: user?.postalCode || "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateUser(formData);

      navigate("/profile");
      alert("profile updates successfully");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto space-y-5 px-4">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          Edit My Profile
        </h1>
        <p className="text-sm sm:text-base text-muted">
          Any changes , Make them down below
        </p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Full Name</label>
          <Input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Gelana Techan"
            variant="form"
            size="md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Phone</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="09XXXXXXXXX"
            variant="form"
            size="md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Country</label>
          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Ethiopia"
            variant="form"
            size="md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">City</label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Fitche"
            variant="form"
            size="md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Red Avenue street"
            variant="form"
            size="md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Postal Code
          </label>
          <Input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="et-123245"
            variant="form"
            size="md"
          />
        </div>
        <Button
          variant="primary"
          size="md"
          type="submit"
          className="w-full sm:w-auto"
        >
          Save
        </Button>
      </form>
    </section>
  );
}

export default EditProfile;
