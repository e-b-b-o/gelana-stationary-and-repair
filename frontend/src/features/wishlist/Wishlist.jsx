import { useState } from "react";
import { EmptyWishlist } from "./EmptyWishlist";
import { useWishlist } from "./WishlistContext";
import { useCart } from "../cart/CartContext";
import WishlistItem from "./WishlistItem";
import { SkeletonListItem } from "../../ui/Skeleton";
import { useEffect } from "react";

function Wishlist() {
  const { wishlistItems, removeMultipleItems } = useWishlist();
  const { addItem } = useCart();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  function handleToggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll() {
    if (selectedIds.size === wishlistItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(wishlistItems.map((item) => item.id)));
  }

  function handleRemoveSelected() {
    removeMultipleItems([...selectedIds]);
    setSelectedIds(new Set());
  }

  function handleMoveToCart() {
    const selectedItems = wishlistItems.filter((item) =>
      selectedIds.has(item.id)
    );
    selectedItems.forEach((item) => addItem(item));
    removeMultipleItems([...selectedIds]);
    setSelectedIds(new Set());
  }

  if (!isLoading && wishlistItems?.length === 0) return <EmptyWishlist />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in-up">
      <div className="space-y-5 sm:space-y-6 min-w-0">
        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
            My Wishlist
          </h1>
          <p className="text-sm text-gray-500">
            Save products for later and revisit them anytime.
          </p>
        </div>

        {/* Wishlist Container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {/* Left — Select All */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={handleSelectAll}
            >
              <div className="shrink-0">
                {!isLoading && selectedIds.size === wishlistItems.length && wishlistItems.length > 0 ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded border border-black bg-black text-white text-xs">
                    ✓
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded border border-gray-300 bg-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {isLoading
                  ? "Loading..."
                  : `${selectedIds.size}/${wishlistItems.length} items selected`}
              </span>
            </div>

            {/* Right — Bulk Actions */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {selectedIds.size > 0 && (
                <>
                  <button
                    className="hover:text-primary transition-colors font-medium"
                    onClick={handleMoveToCart}
                  >
                    Move to Cart ({selectedIds.size})
                  </button>
                  <button
                    className="hover:text-red-500 transition-colors font-medium"
                    onClick={handleRemoveSelected}
                  >
                    Remove ({selectedIds.size})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-200">
            {isLoading
              ? [...Array(3)].map((_, i) => <SkeletonListItem key={i} />)
              : wishlistItems.map((product) => (
                  <WishlistItem
                    product={product}
                    key={product.id}
                    isSelected={selectedIds.has(product.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
