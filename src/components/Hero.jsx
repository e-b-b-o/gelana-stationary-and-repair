import Button from "./Button";

function Hero() {
  return (
    <header className="relative h-[90vh] flex items-center  mt-2">
      <div
        className="absolute inset-0 bg-cover bg-center items-center"
        style={{
          backgroundImage: "url(/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png)",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-6xl mx-auto md:mx-0 px-4 text-white md:text-left">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Your Best Stationery Store & Laptop Repair in Town
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-200">
            Buy quality stationery, find reliable laptop parts, and book
            professional repair services — all in one place.
          </p>
          <div className="flex mt-6 gap-4">
            <Button>Shop Products</Button>
            <Button>Book Repair</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
