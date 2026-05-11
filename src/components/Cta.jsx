import Button from "./Button";

function Cta() {
  return (
    <section className="w-full mx-auto px-4 py-12 md:py-16 text-center space-y-6 bg-blue-300 flex flex-col">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-5xl font-bold">
          Ready to Get Started?
        </h2>
        <p className="text-muted text-sm sm:text-base">
          Shop quality products or book a repair service with ease.
        </p>
      </div>
      <div className="space-x-3 flex items-center justify-center">
        <Button size="md" variant="primary">
          Shop Products
        </Button>
        <Button size="md" variant="outline">
          Book Repair
        </Button>
      </div>
    </section>
  );
}

export default Cta;
