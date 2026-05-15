import products from "../../data/products";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ProductCard from "./ProductCard";

function Products() {
  return (
    <section className="space-y-6 md:space-y-15 mx-auto max-w-6xl py-12 sm:py-16 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          Products
        </h1>
        <p className="text-sm sm:text-base text-muted">
          Find the best stationery and laptop parts
        </p>
      </div>
      <div className="flex justify-between max-w-4xl mx-auto flex-col md:flex-row gap-3">
        <div className="flex flex-wrap gap-3 ">
          <Button variant="ghost" size="sm">
            ALL
          </Button>
          <Button variant="ghost" size="sm">
            STATIONERY
          </Button>
          <Button variant="ghost" size="sm">
            LAPTOP PARTS
          </Button>
        </div>
        <Input />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

export default Products;
