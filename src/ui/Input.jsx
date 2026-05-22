// ui/Input.jsx

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Input({
  placeholder,
  className = "",
  variant = "form",
  size = "md",
  type = "text",
  onChange,
  value,
}) {
  const base = "w-full  outline-none transition-all duration-300";

  const variants = {
    search:
      "border border-primary/20 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 pl-10 text-primary placeholder:text-gray-400",

    form: "border border-gray-300 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-4 text-primary placeholder:text-gray-400",
  };

  const sizes = {
    sm: "h-10 text-sm",
    md: "h-12 text-sm md:text-base",
    lg: "h-14 text-base",
  };

  return (
    <div className="relative w-full">
      {variant === "search" && (
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      )}

      <input
        type={type}
        placeholder={placeholder}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;
