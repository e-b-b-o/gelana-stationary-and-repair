import FeatureCard from "./FeatureCard";
import {
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

function WhyUs() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold">Why Choose Us</h2>
        <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
          We provide reliable products and services designed to meet your
          everyday needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <FeatureCard
          icon={<ShieldCheckIcon className="w-14 h-14 text-primary" />}
          title="Quality Products"
          description="Carefully selected stationery and laptop parts you can rely on."
        />

        <FeatureCard
          icon={<WrenchScrewdriverIcon className="w-14 h-14 text-primary" />}
          title="Expert Repair"
          description="Handled by skilled technicians with real experience."
        />

        <FeatureCard
          icon={<ClockIcon className="w-14 h-14 text-primary" />}
          title="Fast Service"
          description="Quick turnaround for both purchases and repairs."
        />

        <FeatureCard
          icon={<CurrencyDollarIcon className="w-14 h-14 text-primary" />}
          title="Affordable Prices"
          description="Get the best value without compromising quality."
        />
      </div>
    </section>
  );
}

export default WhyUs;
