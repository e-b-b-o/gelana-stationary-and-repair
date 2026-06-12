import EmptyState from "../../ui/EmptyState";
import { HeartIcon } from "@heroicons/react/24/outline";

export function EmptyWishlist() {
  return (
    <EmptyState
      icon={HeartIcon}
      title="Your wishlist is empty"
      description="Save items you love here and come back to them anytime."
      actionText="Explore Products"
      actionTo="/products"
    />
  );
}
