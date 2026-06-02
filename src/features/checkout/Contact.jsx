import { useState } from "react";
import { validateContact } from "../../utils/Validator";
import { PHONE_CODES } from "./data";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

/* ══════════════════════════════════════════
   STEP 1 — CONTACT
══════════════════════════════════════════ */
export function ContactStep({ data, onChange, onContinue, onCancel }) {
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  const handleContinue = () => {
    const e = validateContact(data);
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  return (
    <div className="flex flex-col gap-5 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={data.firstName}
          onChange={set("firstName")}
          placeholder="John"
          error={errors.firstName}
          className="rounded-md"
        />
        <Input
          label="Last Name"
          value={data.lastName}
          onChange={set("lastName")}
          placeholder="Doe"
          error={errors.lastName}
          className="rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <label className="text-sm font-bold text-gray-700">Phone</label>
          <div className="flex w-full min-w-0">
            <select
              value={data.phoneCode}
              onChange={set("phoneCode")}
              className="rounded-l-md border-y border-l border-gray-300 bg-gray-50 px-2 py-3 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer w-[80px] shrink-0 min-w-0"
            >
              {PHONE_CODES.map((p) => (
                <option key={p.label} value={p.code}>
                  {p.flag} {p.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={data.phone}
              onChange={set("phone")}
              placeholder="912 345 678"
              className={`flex-1 min-w-0 rounded-r-md border bg-white px-3 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.phone && (
            <span className="text-xs text-red-500 font-medium">
              {errors.phone}
            </span>
          )}
        </div>
        <Input
          label="Email Address"
          type="email"
          value={data.email}
          onChange={set("email")}
          placeholder="john@example.com"
          error={errors.email}
          className="rounded-md"
        />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          onClick={handleContinue}
          className="w-full rounded-md py-3.5"
          size="lg"
        >
          Continue to Delivery
        </Button>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="w-full rounded-md py-3.5 text-gray-500"
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
}
