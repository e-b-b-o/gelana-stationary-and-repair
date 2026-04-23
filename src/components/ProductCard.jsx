import Button from "./Button";
import { formatCurrency } from "../utils/formatCurrency";
import { StarIcon } from "@heroicons/react/16/solid";

function ProductCard({ product }) {
  return (
    <div className="space-y-3 p-4 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <img
        src={product.image}
        alt="product image"
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
      <div className="w-full">
        <Button variant="primary" size="sm">
          Add to cart
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
