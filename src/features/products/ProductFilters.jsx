import { useSearchParams } from "react-router-dom";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  //Derived state

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";

  // functions

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
    <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
      <input
        type="text"
        placeholder="Search products..."
        value={currentSearch}
        onChange={handleSearch}
        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full"
      />

      <select
        value={currentCategory}
        onChange={handleCategoryChange}
        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
      >
        <option value="all">All Categories</option>
        <option value="stationery">Stationery</option>
        <option value="laptop">Laptop Parts</option>
      </select>
    </div>
  );
}
