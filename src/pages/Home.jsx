import Categories from "../components/Categories";
import Cta from "../components/Cta";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";

function Home() {
  return (
    <div className="flex gap-10 flex-col">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <Cta />
    </div>
  );
}

export default Home;
