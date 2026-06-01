import { useLocation, Navigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "../../ui/Button";

export function Order() {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 max-w-2xl w-full text-center space-y-6">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg">
          Thank you for your order. We've sent a confirmation email to <span className="font-bold text-gray-800">{orderDetails.contact.email}</span>.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 md:p-8 text-left space-y-6 border border-gray-100 mt-8">
          <div className="flex justify-between items-center border-b border-gray-200 pb-6">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Order Number</p>
              <p className="text-xl font-extrabold text-primary">{orderDetails.orderNum}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-xl font-extrabold text-primary">ETB {orderDetails.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-2">
            <div>
              <h3 className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-3">Delivery Address</h3>
              <p className="text-primary font-bold text-lg mb-1">{orderDetails.contact.firstName} {orderDetails.contact.lastName}</p>
              <p className="text-gray-600">{orderDetails.delivery.address}</p>
              <p className="text-gray-600">{orderDetails.delivery.city}, {orderDetails.delivery.country}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-3">Delivery Method</h3>
              <p className="text-primary font-bold text-lg capitalize">{orderDetails.delivery.deliveryMethod}</p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button variant="primary" to="/" size="lg" className="w-full md:w-auto md:px-12 rounded-md">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}