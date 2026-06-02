import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../../data/products";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { SkeletonProductCard } from "../../ui/Skeleton";

function Products() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "all";

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(q);
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 md:space-y-8 animate-fade-in-up">
      <div className="text-center space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
          Products
        </h1>
        <p className="text-sm sm:text-base text-muted">
          Find the best stationery and laptop parts
        </p>
      </div>
      <ProductFilters />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-gray-500 text-lg font-medium">No products found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
