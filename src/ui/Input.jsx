import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Input({ placeholder, classname, variant, size }) {
  const base =
    "w-full outline-0 pl-7 pr-2 py-1 text-sm border border-gray-300 rounded-md";

  const variants = {
    primary: "bg-primary text-white hover:opacity-80 border-primary border-2",
    search:
      "border-primary text-primary  border-2  hover:bg-primary hover:text-white  hover:border-primary ",
  };
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={base + variants[variant] + sizes[size] + classname}
    />
  );
}

export default Input;
