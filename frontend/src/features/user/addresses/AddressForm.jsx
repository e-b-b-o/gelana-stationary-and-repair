import { useState } from "react";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";

function AddressForm({ initialData = null, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "Home",
    country: initialData?.country || "",
    city: initialData?.city || "",
    address: initialData?.address || "",
    postalCode: initialData?.postalCode || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.country || !formData.city || !formData.address) {
      setError("Please fill out all required fields (Country, City, Address).");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border border-gray-200 mt-4 mb-6">
      <h4 className="text-lg font-bold text-primary mb-4">
        {initialData ? "Edit Address" : "Add New Address"}
      </h4>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Title (e.g. Home, Office)"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Home"
            variant="form"
            size="md"
          />
          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="et-123245"
            variant="form"
            size="md"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Ethiopia"
            variant="form"
            size="md"
          />
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Addis Ababa"
            variant="form"
            size="md"
          />
        </div>
        <Input
          label="Street Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main Street, Apt 4B"
          variant="form"
          size="md"
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </Button>
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
