import Button from "./Button";

function Categories() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 space-y-8 text-center">
      <div>
        <h2 className="font-bold text-2xl md:text-3xl">Explore Our Services</h2>
        <p className="text-md text-muted">
          Explore our range of products and services tailored to your needs.
        </p>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
        <div className="bg-primary/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1">
          <h3 className="text-lg md:text-xl font-semibold">Stationery</h3>
          <p className="text-sm md:text-base text-muted">
            A place where u can find neccesarry stationery items and make it
            yours
          </p>
          <Button variant="outline" size="sm" to="/products">
            Shop Now
          </Button>
        </div>
        <div className="bg-primary/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1">
          <h3 className="text-lg md:text-xl font-semibold">Laptop Parts</h3>
          <p className="text-sm md:text-base text-muted">
            small to large laptop parts thats exact to your laptop brand
          </p>
          <Button variant="outline" size="sm" to="/products">
            Shop Now
          </Button>
        </div>
        <div className="bg-primary/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1">
          <h3 className="text-lg md:text-xl font-semibold">Repair</h3>
          <p className="text-sm md:text-base text-muted">
            Let the engeneer take a loook at your laptop and find exact issues
            and repair them for you
          </p>
          <Button variant="outline" size="sm" to="booking">
            Book Repair
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Categories;
