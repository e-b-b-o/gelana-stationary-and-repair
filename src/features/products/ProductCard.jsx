import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { StarIcon } from "@heroicons/react/16/solid";
import { useCart } from "../cart/CartContext";
import { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();


  const handleAdd = () => {
    addItem(product);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };



  return (
    <div className="space-y-3 p-4 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
      <img
        src={product.image}
        alt={product.name}
        className="h-60 w-full object-cover rounded-sm"
      />
      <div>
        <h3 className="font-bold text-base">{product.name}</h3>
        <p className="text-muted text-xs uppercase">{product.category}</p>
        <p className="font-bold text-base">{formatCurrency(product.price)}</p>
        <span className="font-semibold text-sm">
          {product.rating}
          <StarIcon className="h-4.5 text-amber-500 inline ml-1 " />
        </span>
      </div>
      <div className="w-full flex gap-4">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={isAdded}
        >
          Add to cart
        </Button>
        {isAdded && (
          <div className="flex justify-center items-center gap-1  bg-green-500 px-2 py-1 rounded-sm">
            <CheckBadgeIcon className="w-4 h-4 text-white cursor-default" />
            <span className="text-sm">added</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
