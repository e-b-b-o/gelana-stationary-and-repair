import { useState } from "react";
import { CITIES_BY_COUNTRY, COUNTRIES, DELIVERY_OPTIONS } from "./data";
import { validateDelivery } from "../../utils/Validator";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { SummaryBar } from "./SummaryBar";
import Select from "../../ui/Select";

/* ══════════════════════════════════════════
   STEP 2 — DELIVERY
══════════════════════════════════════════ */
export function DeliveryStep({
  data,
  onChange,
  onContinue,
  onBack,
  contactSummary,
}) {
  const [errors, setErrors] = useState({});
  const cities = CITIES_BY_COUNTRY[data.country] || [];

  const set = (field) => (e) => {
    if (field === "country")
      onChange({ ...data, country: e.target.value, city: "" });
    else onChange({ ...data, [field]: e.target.value });
  };

  const handleContinue = () => {
    const e = validateDelivery(data);
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  return (
    <div className="flex flex-col gap-5 mt-8">
      <SummaryBar text={contactSummary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Address Inputs */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Country"
              value={data.country}
              onChange={set("country")}
              options={COUNTRIES}
              placeholder="Select country"
              error={errors.country}
            />
            <Select
              label="City"
              value={data.city}
              onChange={set("city")}
              options={cities}
              placeholder={data.country ? "Select city" : "Select country first"}
              error={errors.city}
            />
          </div>

          <Input
            label="Street Address"
            value={data.address}
            onChange={set("address")}
            placeholder="123 Main Street, Apt 4B"
            error={errors.address}
            className="rounded-md"
          />
        </div>

        {/* Right Column: Delivery Options */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">
            Delivery Method
          </label>
          <div className="flex flex-col gap-3">
          {DELIVERY_OPTIONS.map((opt) => {
            const selected = data.deliveryMethod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...data, deliveryMethod: opt.id })}
                className={`flex items-center gap-4 w-full rounded-md border p-4 text-left transition-all duration-200 cursor-pointer ${
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : errors.deliveryMethod
                      ? "border-red-300 bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? "border-primary" : "border-gray-300"}`}
                >
                  {selected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {opt.price}
                </span>
              </button>
            );
          })}
          </div>
          {errors.deliveryMethod && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.deliveryMethod}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          onClick={handleContinue}
          className="w-full rounded-md py-3.5"
          size="lg"
        >
          Continue to Payment
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full rounded-md py-3.5"
        >
          Back to Contact
        </Button>
      </div>
    </div>
  );
}
