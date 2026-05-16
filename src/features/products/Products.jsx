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
      <div className="flex sm:justify-between items-center  mx-auto flex-col md:flex-row gap-3 md:px-15 lg:px-0">
        <div className="flex flex-wrap gap-3 ">
          <Button variant="outline" size="xs">
            ALL
          </Button>
          <Button variant="outline" size="xs">
            STATIONERY
          </Button>
          <Button variant="outline" size="xs">
            LAPTOP PARTS
          </Button>
        </div>
        <Input />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:px-15 lg:px-0">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

export default Products;
