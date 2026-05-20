import products from "../../data/products";
import CartItems from "./CartItems";
import Button from "../../ui/Button";

function Cart() {
  const subtotal = products.reduce((acc, product) => acc + product.price, 0);

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.7fr]">
          {/* LEFT */}
          <div className="space-y-5 sm:space-y-6 min-w-0">
            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Your Cart
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
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded border border-black bg-black text-white text-xs">
                    ✓
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {products.length}/{products.length} items selected
                  </span>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <button className="hover:text-black transition-colors">
                    Wishlist
                  </button>

                  <button className="hover:text-red-500 transition-colors">
                    Remove
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {products.map((product) => (
                  <CartItems product={product} key={product.id} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">
            <div className="rounded-md bg-black p-4 sm:p-6 text-white lg:sticky lg:top-24">
              <div className="space-y-6">
                {/* Delivery */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Add $50 more for free delivery
                  </p>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full w-[70%] bg-primary"></div>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-4 border-t border-gray-800 pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base text-gray-400">
                      Subtotal
                    </span>

                    <span className="text-xl sm:text-2xl font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400">
                    Taxes and shipping calculated at checkout.
                  </p>
                </div>

                {/* Checkout */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full rounded-md"
                >
                  Proceed to Checkout
                </Button>

                {/* Info */}
                <div className="space-y-3 border-t border-gray-800 pt-6 text-sm text-gray-400">
                  <div className="flex justify-between gap-3">
                    <span>Shipping</span>
                    <span className="text-right">Calculated later</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span>Support</span>
                    <span>24/7</span>
                  </div>
                </div>
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
