import Button from "./Button";

function Cta() {
  return (
    <section className="max-w-8xl mx-auto px-4 py-8 text-center space-y-3 bg-blue-300 rounded-sm flex flex-col">
      <h2 className="text-3xl md:text-3xl font-bold">Ready to Get Started?</h2>
      <p className="text-muted text-sm sm:text-base">
        Shop quality products or book a repair service with ease.
      </p>
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
