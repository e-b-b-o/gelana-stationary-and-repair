import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";

function Home() {
  return (
    <div className="flex gap-10 flex-col">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
    </div>
  );
}

export default Home;
