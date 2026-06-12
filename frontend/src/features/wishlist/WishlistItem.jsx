import {
  CheckBadgeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../../ui/Button";
import { useWishlist } from "./WishlistContext";
import { useCart } from "../cart/CartContext";
import { useState } from "react";

function WishlistItem({ product, isSelected = false, onToggleSelect }) {
  const { toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    if (onToggleSelect) onToggleSelect(product.id);
  };

  return (
    <div className="flex gap-3 p-3 sm:gap-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200">
      {/* Checkbox */}
      <div className="pt-1 shrink-0 cursor-pointer" onClick={handleCheckboxClick}>
        {isSelected ? (
          <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded border border-black bg-black text-white">
            <CheckIcon className="h-3 w-3" />
          </div>
        ) : (
          <div className="h-4 w-4 sm:h-5 sm:w-5 rounded border border-gray-300 bg-white hover:border-gray-400 transition-colors" />
        )}
      </div>

      {/* Product Image */}
      <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="min-w-0 flex-1">
        {/* TOP */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm sm:text-base font-semibold text-gray-900">
              {product.name}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-gray-500">
              <span>{product.category}</span>
              <span>•</span>
              <span>In Stock</span>
            </div>
          </div>

          {/* Remove */}
          <button
            className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => toggleWishlist(product)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* BOTTOM */}
        <div className="mt-3 flex flex-col gap-2.5 xs:flex-row xs:items-center xs:justify-between">
          {/* Price */}
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>

          {/* Add to cart */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={isAdded}
            >
              Add to cart
            </Button>
            {isAdded && (
              <div className="flex items-center gap-1 bg-green-500 px-2 py-1 rounded-md">
                <CheckBadgeIcon className="w-3.5 h-3.5 text-white" />
                <span className="text-xs text-white font-medium">added</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistItem;
