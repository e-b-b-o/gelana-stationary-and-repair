import { useSearchParams } from "react-router-dom";
import products from "../../data/products";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

function Products() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "all";

  // Derived useState

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(q);
    const matchesCategory = category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });
  return (
    <section className="space-y-6 md:space-y-15 mx-auto max-w-6xl py-12 sm:py-16 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
          Products
        </h1>
        <p className="text-sm sm:text-base text-muted">
          Find the best stationery and laptop parts
        </p>
      </div>
      <ProductFilters />
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">
          No products found matching your criteria.
        </p>
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
