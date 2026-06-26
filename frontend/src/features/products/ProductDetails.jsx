import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import Button from "../../ui/Button";
import products from "../../data/products";
import { useCart } from "../cart/CartContext";
import { useWishlist } from "../wishlist/WishlistContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/getImageUrl";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addItem } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in-up">
        <div className="w-40 h-3 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-gray-100 rounded-xl h-[260px] sm:h-[320px] lg:h-[400px] animate-pulse" />
          <div className="space-y-4">
            <div className="w-20 h-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-3/4 h-7 bg-gray-200 rounded animate-pulse" />
            <div className="w-28 h-7 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2 pt-3">
              <div className="w-full h-3.5 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-3.5 bg-gray-200 rounded animate-pulse" />
              <div className="w-2/3 h-3.5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="flex-1 h-11 bg-gray-200 rounded-md animate-pulse" />
              <div className="w-28 h-11 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">Product not found</h2>
          <p className="text-muted">This product doesn't exist or may have been removed.</p>
          <Button to="/products" variant="primary" size="md">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
      {/* BACK BUTTON */}
      <div className="mb-6">
        <Button to="/products" variant="ghost" size="sm" className="text-gray-500 hover:text-primary px-0 flex items-center gap-2">
          &larr; Back to Products
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10 mb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: IMAGE */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-4 sm:p-6 min-h-[240px] sm:min-h-[300px] lg:min-h-[400px]">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="max-w-full max-h-[360px] object-contain drop-shadow-lg"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="space-y-3.5">
          {/* Category badge */}
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-muted border border-gray-200 rounded-full px-2.5 py-0.5">
            {product.category}
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-primary leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {(product.rating !== undefined && product.rating !== null) && (
            <div className="flex items-center gap-1.5 pt-1">
              <StarIcon className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm text-primary">{product.rating}</span>
            </div>
          )}

          {/* Price */}
          <div className="text-2xl font-extrabold text-primary">
            {formatCurrency(product.price)}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className={product.stock > 0 ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </span>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Quantity</label>
            <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                className="px-3.5 py-2 text-primary hover:bg-gray-50 transition font-bold text-base leading-none disabled:opacity-40"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                &minus;
              </button>
              <span className="px-4 py-2 font-bold text-primary border-x border-gray-200 min-w-[2.5rem] text-center text-sm">
                {quantity}
              </span>
              <button
                className="px-3.5 py-2 text-primary hover:bg-gray-50 transition font-bold text-base leading-none disabled:opacity-40"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={isAdded || product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-2.5 px-5 rounded-md transition-all text-sm ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`px-4 py-2.5 rounded-md border font-bold transition flex items-center justify-center gap-2 text-sm ${
                isWishlisted
                  ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              <HeartIcon className={`w-4 h-4 ${isWishlisted ? "fill-red-500 stroke-red-500" : ""}`} />
              <span className="hidden sm:inline">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-extrabold text-primary">
              Related Products
            </h2>
            <Button to="/products" variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                to={`/products/${related.id}`}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="bg-gray-50 flex items-center justify-center p-4 h-36 group-hover:bg-gray-100 transition-colors">
                  <img
                    src={getImageUrl(related.image)}
                    alt={related.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-0.5">
                  <p className="text-[10px] text-muted uppercase tracking-wide font-semibold">
                    {related.category}
                  </p>
                  <h3 className="font-bold text-xs text-primary line-clamp-2 leading-snug">
                    {related.name}
                  </h3>
                  <p className="font-extrabold text-primary text-xs pt-0.5">
                    {formatCurrency(related.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
