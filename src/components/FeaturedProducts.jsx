import products from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const featuredProducts = products.filter((products) => products.featured);
  const limitedProducts = featuredProducts.slice(0, 4);

  return (
    <section className="space-y-3 max-w-6xl">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
        <p className="text-md text-muted ">
          Best selling products at our store
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {limitedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
