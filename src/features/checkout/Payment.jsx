import { useState } from "react";
import { validatePayment } from "../../utils/Validator";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { SummaryBar } from "./SummaryBar";
import Spinner from "../../ui/Spinner";

/* ══════════════════════════════════════════
   STEP 3 — PAYMENT
══════════════════════════════════════════ */
export function PaymentStep({
  data,
  onChange,
  onPlace,
  onBack,
  deliverySummary,
  isProcessing,
}) {
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  const formatCard = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 16);
    v = v.replace(/(.{4})/g, "$1 ").trim();
    onChange({ ...data, cardNumber: v });
  };

  const formatExpiry = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    onChange({ ...data, expiry: v });
  };

  const formatCVV = (e) => {
    onChange({ ...data, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) });
  };

  const handlePlace = () => {
    const e = validatePayment(data);
    setErrors(e);
    if (!Object.keys(e).length) onPlace();
  };

  return (
    <div className="flex flex-col gap-5 mt-8">
      <SummaryBar text={deliverySummary} />

      <Input
        label="Name on Card"
        value={data.cardName}
        onChange={set("cardName")}
        placeholder="John Doe"
        error={errors.cardName}
        className="rounded-md"
      />

      <div className="relative">
        <Input
          label="Card Number"
          value={data.cardNumber}
          onChange={formatCard}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          error={errors.cardNumber}
          className="rounded-md pr-24"
        />
        <div className="absolute right-3 top-[34px] flex gap-1">
          <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-blue-800 border border-gray-200">
            VISA
          </div>
          <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-red-600 border border-gray-200">
            MC
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          value={data.expiry}
          onChange={formatExpiry}
          placeholder="MM/YY"
          maxLength={5}
          error={errors.expiry}
          className="rounded-md"
        />
        <Input
          label="CVV"
          value={data.cvv}
          onChange={formatCVV}
          placeholder="123"
          maxLength={4}
          error={errors.cvv}
          className="rounded-md"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none mt-2">
        <input
          type="checkbox"
          checked={data.sameAddress}
          onChange={(e) => onChange({ ...data, sameAddress: e.target.checked })}
          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer border-gray-300"
        />
        <span className="text-sm text-gray-600 font-medium">
          Billing address same as delivery
        </span>
      </label>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          onClick={handlePlace}
          className="w-full rounded-md py-3.5 flex items-center justify-center gap-2"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing && <Spinner size="sm" />}
          {isProcessing ? "Processing..." : "Place Order Securely"}
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full rounded-md py-3.5"
          disabled={isProcessing}
        >
          Back to Delivery
        </Button>
      </div>
    </div>
  );
}
