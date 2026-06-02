import EmptyState from "../../ui/EmptyState";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingCartIcon}
      title="Your cart is empty"
      description="Looks like you haven't added anything to your cart yet. Discover our top-quality stationery and laptop parts!"
      actionText="Start Shopping"
      actionTo="/products"
    />
  );
}
