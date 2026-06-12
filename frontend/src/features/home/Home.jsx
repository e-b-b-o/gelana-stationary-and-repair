import Categories from "./Categories";
import Cta from "./Cta";
import FeaturedProducts from "../products/FeaturedProducts";

import Hero from "./Hero";
import WhyUs from "./WhyUs";

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
