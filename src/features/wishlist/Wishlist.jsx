import CartItem from "../cart/CartItem";
import { EmptyWishlist } from "./EmptyWishlist";
import { useWishlist } from "./WishlistContext";
import WishlistItem from "./WishlistItem";

function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();

  if (wishlistItems?.length === 0) return <EmptyWishlist />;
  return (
    <div className="max-w-6xl mx-auto py-12 sm:py-16 md:py-20">
      <div className="space-y-5 sm:space-y-6 min-w-0">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            My Wishlist
          </h1>

          <p className="text-sm text-gray-500">
            Save products for later and revisit them anytime.
          </p>
        </div>

        {/* Cart Container */}
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {/* Left */}
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded border border-black bg-black text-white text-xs">
                ✓
              </div>

              <span className="text-sm font-medium text-gray-700">
                3/5 items selected
              </span>
            </div>

            {/* Right */}

            <button
              className="hover:text-red-500 transition-colors"
              onClick={() => clearWishlist()}
            >
              Remove
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-200">
            {wishlistItems.map((product) => (
              <WishlistItem product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
