import Button from "./Button";

function ProductCard({ product }) {
  return (
    <div className="space-y-3">
      <img
        src={product.image}
        alt="product image"
        className="h-60 w-auto object-cover rounded-sm"
      />
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-md">{product.name}</h3>
          <p className="font-semibold text-sm">{product.category}</p>
        </div>
        <div>
          <p className="text-muted text-sm">{product.price}</p>
          <span className="font-semibold text-sm">{product.rating}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" size="sm">
          Buy
        </Button>
        <Button variant="outline" size="sm">
          Add to cart
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
