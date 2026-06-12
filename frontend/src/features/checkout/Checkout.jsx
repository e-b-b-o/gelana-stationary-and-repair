import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import { useCart } from "../cart/CartContext";
import { useOrder } from "../order/OrderContext";
import { DELIVERY_OPTIONS } from "./data";
import { Stepper } from "./Stepper";
import { ContactStep } from "./Contact";
import { DeliveryStep } from "./Delivery";
import { PaymentStep } from "./Payment";

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
  const { createOrder } = useOrder();

  const [step, setStep] = useState(1);
  const [contact, setContact] = useState(INIT_CONTACT);
  const [delivery, setDelivery] = useState(INIT_DELIVERY);
  const [payment, setPayment] = useState(INIT_PAYMENT);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to products if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
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
        subtotal: totalPrice,
        shipping: DELIVERY_OPTIONS.find((d) => d.id === delivery.deliveryMethod)?.priceNum || 0,
        totalPrice:
          totalPrice +
          (DELIVERY_OPTIONS.find((d) => d.id === delivery.deliveryMethod)
            ?.priceNum || 0),
      };

      const newOrder = createOrder(orderDetails);
      console.log("ORDER PLACED:", newOrder);
      clear(); // Clear cart
      setIsProcessing(false);
      navigate("/order/confirmation", { state: { orderDetails: newOrder }, replace: true });
    }, 1500);
  }, [contact, delivery, payment, cartItems, totalPrice, clear, navigate, createOrder]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel and return to cart?")) {
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 md:py-12 animate-fade-in-up">
      <div className="w-full max-w-4xl bg-white rounded-xl p-5 sm:p-7 md:p-8 shadow-sm border border-gray-100">
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
