import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { StarIcon } from "@heroicons/react/16/solid";
import { useCart } from "../cart/CartContext";
import { useState } from "react";
import { CheckBadgeIcon, HeartIcon } from "@heroicons/react/24/solid";
import { useWishlist } from "../wishlist/WishlistContext";

function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);


  const handleAddWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleAdd = () => {
    addItem(product);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };



  return (
    <div className="relative space-y-3 p-4 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
      <button className="absolute right-6 top-6" onClick={handleAddWishlist}>
        <HeartIcon
          className={
            isWishlisted ? "w-8 h-8 fill-red-500" : "w-8 h-8 text-primary"
          }
        />
      </button>
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
