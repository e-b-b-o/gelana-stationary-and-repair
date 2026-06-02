import { useParams, Link } from "react-router-dom";
import { useOrder } from "./OrderContext";
import Button from "../../ui/Button";

export default function OrderDetails() {
  const { id } = useParams();
  const { orders } = useOrder();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Order not found</h2>
        <Button to="/orders">Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 min-h-screen">
      <Link to="/orders" className="text-sm font-bold text-gray-500 hover:text-black mb-6 inline-block">
        &larr; Back to Orders
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-primary">
              Order {order.orderNum}
            </h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <span className="bg-black text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4">
              Shipping Address
            </h3>
            <p className="font-bold text-lg mb-1">
              {order.contact.firstName} {order.contact.lastName}
            </p>
            <p className="text-gray-600">{order.delivery.address}</p>
            <p className="text-gray-600">
              {order.delivery.city}, {order.delivery.country}
            </p>
            <p className="text-gray-600 mt-2">{order.contact.email}</p>
            <p className="text-gray-600">
              {order.contact.phoneCode} {order.contact.phone}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4">
              Payment Information
            </h3>
            <p className="font-bold text-lg mb-1">{order.payment.cardName}</p>
            <p className="text-gray-600">{order.payment.cardNumber}</p>
            <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-6 mb-2">
              Delivery Method
            </h3>
            <p className="text-gray-600 capitalize">
              {order.delivery.deliveryMethod}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            Order Items
          </h3>
          <div className="space-y-4 mb-8">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded bg-gray-50"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold">
                  ETB {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3 max-w-sm ml-auto">
            <div className="flex justify-between text-gray-500 text-sm font-bold">
              <span>Subtotal</span>
              <span>ETB {order.subtotal?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm font-bold">
              <span>Shipping</span>
              <span>ETB {order.shipping?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>ETB {order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
