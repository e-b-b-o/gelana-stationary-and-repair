import { useState, useEffect } from "react";
import { DELIVERY_OPTIONS } from "./data";
import Button from "../../ui/Button";
import { SummaryBar } from "./SummaryBar";
import { useAddress } from "../user/addresses/AddressContext";
import AddressForm from "../user/addresses/AddressForm";

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
  const { addresses, isLoading, createAddress } = useAddress();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select the default address if none is selected
  useEffect(() => {
    if (!data.addressId && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      onChange({ ...data, addressId: defaultAddr.id });
    }
  }, [addresses, data.addressId, onChange, data]);

  const handleContinue = () => {
    const e = {};
    if (!data.addressId) e.addressId = "Please select a delivery address.";
    if (!data.deliveryMethod) e.deliveryMethod = "Please select a delivery method.";
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  const handleAddSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const newAddress = await createAddress(formData);
      onChange({ ...data, addressId: newAddress.id });
      setIsAdding(false);
    } catch (err) {
      alert("Failed to add address: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-8">
      <SummaryBar text={contactSummary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Address Selection */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-gray-700">Select Delivery Address</label>
          
          {isLoading && <p className="text-sm text-gray-500">Loading addresses...</p>}
          
          {!isLoading && addresses.length === 0 && !isAdding && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-sm text-orange-800">
              You don't have any saved addresses. Please add one below.
            </div>
          )}

          {!isLoading && addresses.map((addr) => {
            const selected = data.addressId === addr.id;
            return (
              <div 
                key={addr.id}
                onClick={() => onChange({ ...data, addressId: addr.id })}
                className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
                  selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-primary capitalize">{addr.title || "Address"}</h4>
                    {addr.isDefault && (
                      <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary" : "border-gray-300"}`}>
                    {selected && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                <p className="text-sm text-gray-600">{addr.city}, {addr.country}</p>
              </div>
            );
          })}

          {errors.addressId && <span className="text-xs text-red-500 font-medium">{errors.addressId}</span>}

          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="text-primary text-sm font-bold flex items-center gap-1 mt-2 hover:underline w-fit"
            >
              + Add New Address
            </button>
          ) : (
            <div className="mt-2">
              <AddressForm 
                onSubmit={handleAddSubmit} 
                onCancel={() => setIsAdding(false)} 
                isSubmitting={isSubmitting} 
              />
            </div>
          )}
        </div>

        {/* Right Column: Delivery Options */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Delivery Method</label>
          <div className="flex flex-col gap-3">
            {DELIVERY_OPTIONS.map((opt) => {
              const selected = data.deliveryMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ ...data, deliveryMethod: opt.id })}
                  className={`flex items-center gap-4 w-full rounded-md border p-4 text-left transition-all duration-200 cursor-pointer ${
                    selected ? "border-primary bg-primary/5 ring-1 ring-primary" : errors.deliveryMethod ? "border-red-300 bg-white" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? "border-primary" : "border-gray-300"}`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{opt.price}</span>
                </button>
              );
            })}
          </div>
          {errors.deliveryMethod && <span className="text-xs text-red-500 font-medium mt-1">{errors.deliveryMethod}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Button onClick={handleContinue} className="w-full rounded-md py-3.5" size="lg">
          Continue to Payment
        </Button>
        <Button onClick={onBack} variant="outline" className="w-full rounded-md py-3.5">
          Back to Contact
        </Button>
      </div>
    </div>
  );
}
