import { useState, useEffect } from "react";
import { useOrder } from "./OrderContext";
import Button from "../../ui/Button";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import EmptyState from "../../ui/EmptyState";
import { SkeletonOrderCard } from "../../ui/Skeleton";

export default function Orders() {
  const { orders } = useOrder();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading && (!orders || orders.length === 0)) {
    return (
      <EmptyState
        icon={ShoppingBagIcon}
        title="No orders yet"
        description="You haven't placed any orders yet. Browse our products and find something you like!"
        actionText="Browse Products"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-h-screen animate-fade-in-up">
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">Your Orders</h1>
        <p className="text-sm text-gray-500">Track and manage your purchase history.</p>
      </div>
      <div className="space-y-4">
        {isLoading
          ? [...Array(3)].map((_, i) => <SkeletonOrderCard key={i} />)
          : orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base sm:text-lg">
                      {order.orderNum}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="text-sm font-bold text-gray-700">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} • ETB {order.totalPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <Button to={`/order/${order.id}`} variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
