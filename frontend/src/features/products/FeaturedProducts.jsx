import ProductCard from "./ProductCard";
import products from "../../data/products";
import { useEffect, useState } from "react";
import { getProducts } from "./productService";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();

      const featured = data.slice(0, 4);
      setFeaturedProducts(featured);
    }

    loadProducts();
  }, []);
  return (
    <section className="space-y-6 md:space-y-8 max-w-6xl mx-auto py-16">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
        <p className="text-sm md:text-base text-muted ">
          Best selling products at our store
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
