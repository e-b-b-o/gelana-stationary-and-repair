import { useSearchParams } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "all";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("q", value);
      else prev.delete("q");
      return prev;
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value !== "all") prev.set("category", value);
      else prev.delete("category");
      return prev;
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Search input */}
      <div className="relative flex-1 min-w-0">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={currentSearch}
          onChange={handleSearch}
          className="w-full h-11 pl-11 pr-4 border border-gray-300 rounded-md bg-white text-sm text-primary placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {/* Category select */}
      <div className="relative sm:w-48 min-w-0">
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="w-full h-11 px-4 pr-10 border border-gray-300 rounded-md bg-white text-sm text-primary outline-none appearance-none cursor-pointer transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-400"
        >
          <option value="all">All Categories</option>
          <option value="stationery">Stationery</option>
          <option value="laptop">Laptop Parts</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
}
