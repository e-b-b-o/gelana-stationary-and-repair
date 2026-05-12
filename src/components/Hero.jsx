import Button from "./Button";

function Hero() {
  return (
    <header className="relative h-screen flex items-center md:p-15  mb-16">
      <div
        className="absolute inset-0 bg-cover bg-center items-center "
        style={{
          backgroundImage: "url(/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png)",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/20" />
      <div className="relative z-10 max-w-6xl mx-auto md:mx-0 px-4 text-white md:text-left text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Your Best Stationery Store & Laptop Repair in Town
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-200">
            Buy quality stationery, find reliable laptop parts, and book
            professional repair services — all in one place.
          </p>
          <div className="flex flex-col mt-6 gap-4 justify-center md:justify-start sm:w-80 ">
            <Button variant="primary" size="md">
              Shop Products
            </Button>
            <Button variant="outlineHero" size="md">
              Book Repair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
