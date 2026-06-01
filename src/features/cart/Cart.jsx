import Button from "../../ui/Button";
import { useCart } from "./CartContext";
import { EmptyCart } from "./EmptyCart";
import CartItem from "./CartItem";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Cart() {
  const { cartItems, totalPrice, removeMultipleItems } = useCart();
  const [selectedIds, setSelectedIds] = useState(new Set());

  function handleToggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll() {
    if (selectedIds.size === cartItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartItems.map((item) => item.id)));
  }

  function handleRemoveSelected() {
    removeMultipleItems([...selectedIds]);

    setSelectedIds(new Set());
  }

  if (cartItems?.length === 0) return <EmptyCart />;

  return (
    <section className="py-10 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.7fr]">
          {/* LEFT */}
          <div className="space-y-5 sm:space-y-6 min-w-0">
            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                My Cart
              </h1>

              <p className="text-sm text-gray-500">
                Review and manage your selected items
              </p>
            </div>

            {/* Cart Container */}
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
              {/* Toolbar */}
              <div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                {/* Left */}
                <div
                  className="flex items-center gap-2"
                  onClick={handleSelectAll}
                >
                  <div className="pt-1 shrink-0">
                    {selectedIds.size === cartItems.length ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded border border-black bg-black text-white">
                        ✓
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded border border-gray-300 bg-white" />
                    )}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {selectedIds.size}/{cartItems.length} items selected
                  </span>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <NavLink
                    className="hover:text-black transition-colors"
                    to="/wishlist"
                  >
                    Wishlist
                  </NavLink>

                  {selectedIds.size > 0 && (
                    <button
                      className="hover:text-red-500 transition-colors"
                      onClick={handleRemoveSelected}
                    >
                      Remove ({selectedIds.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((product) => (
                  <CartItem
                    product={product}
                    key={product.id}
                    selectedIds={selectedIds}
                    handleToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">
            <div className="rounded-sm shadow-lg border border-gray-200 transparent p-5 lg:sticky lg:top-24">
              <div className="space-y-5">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h3>

                {/* Summary */}
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ETB {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Delivery</span>
                    <span className="font-medium">
                      ETB {totalPrice > 500 ? "0.00" : "50.00"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      ETB{" "}
                      {(totalPrice + (totalPrice > 500 ? 0 : 50)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout */}
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center rounded-sm"
                  to="/checkout"
                >
                  Checkout
                </Button>

                {/* Promo */}
                <button className="text-sm text-gray-500 underline underline-offset-4 hover:text-black transition-colors">
                  Use a promo code
                </button>
              </div>
            </div>
          </div>
          {/* END RIGHT */}
        </div>
      </div>
    </section>
  );
}

export default Cart;
