import { useLocation, Navigate, Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "../../ui/Button";

export default function OrderConfirmation() {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center px-4 py-6 min-h-[calc(100vh-160px)] animate-fade-in-up">
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full text-center space-y-2.5">
        <CheckCircleIcon className="w-10 h-10 text-green-500 mx-auto" />
        <h1 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
          Thank you for your order. Confirmation sent to{" "}
          <span className="font-semibold text-gray-800">
            {orderDetails.contact.email}
          </span>
        </p>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-left space-y-3 border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Order Number
              </p>
              <p className="text-sm font-extrabold text-primary">
                {orderDetails.orderNum}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Total Paid
              </p>
              <p className="text-sm font-extrabold text-primary">
                ETB {orderDetails.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                Delivery Address
              </h3>
              <p className="text-primary font-semibold text-sm">
                {orderDetails.contact.firstName} {orderDetails.contact.lastName}
              </p>
              <p className="text-gray-500 text-xs">{orderDetails.delivery.address}</p>
              <p className="text-gray-500 text-xs">
                {orderDetails.delivery.city}, {orderDetails.delivery.country}
              </p>
            </div>
            <div>
              <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                Delivery Method
              </h3>
              <p className="text-primary font-semibold text-sm capitalize">
                {orderDetails.delivery.deliveryMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-center gap-2.5 flex-col sm:flex-row">
          <Button
            variant="outline"
            to="/orders"
            size="sm"
            className="w-full sm:w-auto sm:px-8 rounded-md"
          >
            View Orders
          </Button>
          <Button
            variant="primary"
            to="/"
            size="sm"
            className="w-full sm:w-auto sm:px-8 rounded-md"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}