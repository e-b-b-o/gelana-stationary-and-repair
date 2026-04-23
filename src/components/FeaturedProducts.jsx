import products from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured);
  const limitedProducts = featuredProducts.slice(0, 4);

  return (
    <section className="space-y-8 max-w-6xl mx-auto py-16">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
        <p className="text-sm md:text-base text-muted ">
          Best selling products at our store
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {limitedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
