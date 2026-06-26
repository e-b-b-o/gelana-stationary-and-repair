import {
  CheckIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../../ui/Button";
import { useCart } from "./CartContext";

import { getImageUrl } from "../../utils/getImageUrl";

function CartItem({ product, selectedIds, handleToggleSelect }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();
  return (
    <div
      className={`flex gap-3 p-3 sm:gap-4 sm:p-5 transition-colors duration-300 ${
        selectedIds.has(product.id) ? "bg-primary/5" : "hover:bg-gray-50"
      }`}
    >
      {/* Checkbox */}
      <div
        className="pt-1 shrink-0 cursor-pointer"
        onClick={() => handleToggleSelect(product.id)}
      >
        {selectedIds.has(product.id) ? (
          <div className="flex h-5 w-5 items-center justify-center rounded border border-black bg-black text-white">
            <CheckIcon className="h-3 w-3" />
          </div>
        ) : (
          <div className="h-5 w-5 rounded border border-gray-300 bg-white" />
        )}
      </div>

      {/* Product Image */}
      <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
        <img
          src={getImageUrl(product.image)}
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
              <span>1-2 yr</span>
              <span>•</span>
              <span>Premium</span>
              <span>•</span>
              <span>3 day delivery</span>
            </div>
          </div>

          {/* Remove */}
          <button
            className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => removeItem(product.id)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
          {/* Price */}
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>

          {/* Quantity */}
          <div className="flex items-center gap-2 self-start">
            <Button
              variant="minimal"
              size="xs"
              className="rounded-md p-1!"
              onClick={() => decreaseQuantity(product.id)}
            >
              <MinusIcon className="h-3 w-3" />
            </Button>

            <span className="min-w-5 text-center text-sm font-medium">
              {product.quantity}
            </span>

            <Button
              variant="minimal"
              size="xs"
              className="rounded-md p-1!"
              onClick={() => increaseQuantity(product.id)}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
