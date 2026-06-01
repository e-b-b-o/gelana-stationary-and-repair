import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import { useCart } from "../cart/CartContext";

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Ethiopia",
  "Germany",
  "France",
  "India",
];

const CITIES_BY_COUNTRY = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds"],
  Canada: ["Toronto", "Vancouver", "Montreal"],
  Australia: ["Sydney", "Melbourne", "Brisbane"],
  Ethiopia: ["Addis Ababa", "Dire Dawa", "Hawassa", "Adama"],
  Germany: ["Berlin", "Hamburg", "Munich"],
  France: ["Paris", "Marseille", "Lyon"],
  India: ["Mumbai", "Delhi", "Bangalore"],
};

const PHONE_CODES = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+1", flag: "🇨🇦", label: "CA" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+251", flag: "🇪🇹", label: "ET" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
];

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard Delivery",
    desc: "5–7 business days",
    price: "Free",
    priceNum: 0,
  },
  {
    id: "express",
    label: "Express Delivery",
    desc: "2–3 business days",
    price: "$9.99",
    priceNum: 9.99,
  },
  {
    id: "overnight",
    label: "Overnight Delivery",
    desc: "Next business day",
    price: "$24.99",
    priceNum: 24.99,
  },
];

/* ══════════════════════════════════════════
   VALIDATORS
══════════════════════════════════════════ */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[\d\s\-()+]{7,15}$/.test(v);
const isCard = (v) => /^\d{16}$/.test(v.replace(/\s/g, ""));
const isExpiry = (v) => {
  const c = v.replace(/\s/g, "");
  if (!/^\d{2}\/\d{2}$/.test(c)) return false;
  const [m] = c.split("/").map(Number);
  return m >= 1 && m <= 12;
};
const isCVV = (v) => /^\d{3,4}$/.test(v);

const validateContact = (f) => {
  const e = {};
  if (!f.firstName.trim()) e.firstName = "First name is required";
  if (!f.lastName.trim()) e.lastName = "Last name is required";
  if (!f.phone.trim() || !isPhone(f.phone))
    e.phone = "Enter a valid phone number";
  if (!f.email.trim() || !isEmail(f.email)) e.email = "Enter a valid email";
  return e;
};

const validateDelivery = (f) => {
  const e = {};
  if (!f.country) e.country = "Select a country";
  if (!f.city) e.city = "Select a city";
  if (!f.address.trim()) e.address = "Enter your street address";
  if (!f.deliveryMethod) e.deliveryMethod = "Choose a delivery method";
  return e;
};

const validatePayment = (f) => {
  const e = {};
  if (!f.cardName.trim()) e.cardName = "Cardholder name required";
  if (!isCard(f.cardNumber))
    e.cardNumber = "Enter a valid 16-digit card number";
  if (!isExpiry(f.expiry)) e.expiry = "Invalid date (MM/YY)";
  if (!isCVV(f.cvv)) e.cvv = "Invalid CVV (3–4 digits)";
  return e;
};

/* ══════════════════════════════════════════
   SHARED UI
══════════════════════════════════════════ */
function SummaryBar({ text }) {
  if (!text) return null;
  return (
    <div className="mb-6 rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700 font-medium">
      {text}
    </div>
  );
}

const STEPS = ["Contact", "Delivery", "Payment"];

function Stepper({ current }) {
  return (
    <div className="flex items-center mb-12 w-full max-w-md mx-auto">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div
            key={label}
            className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}
          >
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  done
                    ? "bg-primary text-white border-2 border-primary"
                    : active
                      ? "bg-white text-primary border-2 border-primary"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-xs font-bold tracking-wider uppercase absolute -bottom-6 whitespace-nowrap transition-colors duration-300 ${
                  done || active ? "text-primary" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  done ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════
   STEP 1 — CONTACT
══════════════════════════════════════════ */
function ContactStep({ data, onChange, onContinue, onCancel }) {
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  const handleContinue = () => {
    const e = validateContact(data);
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  return (
    <div className="flex flex-col gap-5 mt-8">
      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid sm:grid-cols-[1fr_2fr] gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Phone</label>
          <div className="flex">
            <select
              value={data.phoneCode}
              onChange={set("phoneCode")}
              className="rounded-l-md border-y border-l border-gray-300 bg-gray-50 px-2 py-3 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer w-[90px] shrink-0"
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
              placeholder="(555) 123-4567"
              className={`flex-1 rounded-r-md border bg-white px-3 py-3 text-sm md:text-base text-primary placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
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

/* ══════════════════════════════════════════
   STEP 2 — DELIVERY
══════════════════════════════════════════ */
function DeliveryStep({ data, onChange, onContinue, onBack, contactSummary }) {
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

      <div className="grid grid-cols-2 gap-4">
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

      <div className="flex flex-col gap-2 mt-2">
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
          <span className="text-xs text-red-500 font-medium">
            {errors.deliveryMethod}
          </span>
        )}
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

/* ══════════════════════════════════════════
   STEP 3 — PAYMENT
══════════════════════════════════════════ */
function PaymentStep({
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

      <div className="grid grid-cols-2 gap-4">
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
          className="w-full rounded-md py-3.5"
          size="lg"
          disabled={isProcessing}
        >
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

/* ══════════════════════════════════════════
   ROOT — CheckoutPage
══════════════════════════════════════════ */
const INIT_CONTACT = {
  firstName: "",
  lastName: "",
  phoneCode: "+1",
  phone: "",
  email: "",
};
const INIT_DELIVERY = {
  country: "",
  city: "",
  address: "",
  deliveryMethod: "",
  notes: "",
};
const INIT_PAYMENT = {
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  sameAddress: true,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clear } = useCart();

  const [step, setStep] = useState(1);
  const [contact, setContact] = useState(INIT_CONTACT);
  const [delivery, setDelivery] = useState(INIT_DELIVERY);
  const [payment, setPayment] = useState(INIT_PAYMENT);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to products if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button to="/products">Browse Products</Button>
      </div>
    );
  }

  const contactSummary = contact.firstName
    ? `${contact.firstName} ${contact.lastName} • ${contact.phoneCode} ${contact.phone} • ${contact.email}`
    : null;

  const deliverySummary = delivery.address
    ? `${delivery.address}, ${delivery.city}, ${delivery.country} • ${
        DELIVERY_OPTIONS.find((d) => d.id === delivery.deliveryMethod)?.label ??
        ""
      }`
    : null;

  const handlePlace = useCallback(() => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const num = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();

      const orderDetails = {
        orderNum: num,
        contact,
        delivery,
        payment: {
          ...payment,
          cardNumber: "**** **** **** " + payment.cardNumber.slice(-4),
        },
        items: cartItems,
        totalPrice:
          totalPrice +
          (DELIVERY_OPTIONS.find((d) => d.id === delivery.deliveryMethod)
            ?.priceNum || 0),
      };

      console.log("ORDER PLACED:", orderDetails);
      clear(); // Clear cart
      setIsProcessing(false);
      navigate("/order", { state: { orderDetails }, replace: true });
    }, 1500);
  }, [contact, delivery, payment, cartItems, totalPrice, clear, navigate]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel and return to cart?")) {
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-[600px] bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-10 text-center">
          Checkout
        </h1>

        <Stepper current={step} />

        {step === 1 && (
          <ContactStep
            data={contact}
            onChange={setContact}
            onContinue={() => setStep(2)}
            onCancel={handleCancel}
          />
        )}
        {step === 2 && (
          <DeliveryStep
            data={delivery}
            onChange={setDelivery}
            onContinue={() => setStep(3)}
            onBack={() => setStep(1)}
            contactSummary={contactSummary}
          />
        )}
        {step === 3 && (
          <PaymentStep
            data={payment}
            onChange={setPayment}
            onPlace={handlePlace}
            onBack={() => setStep(2)}
            deliverySummary={deliverySummary}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
}
