function Select({
  label,
  error,
  value,
  onChange,
  options,
  placeholder,
  name,
  id,
  className = "",
  size = "md"
}) {
  const base = "w-full outline-none transition-all duration-200 appearance-none bg-white cursor-pointer rounded-md hover:border-gray-400";
  
  const stateClasses = `border focus:border-primary focus:ring-4 focus:ring-primary/10 px-4 pr-10 text-primary ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  const sizes = {
    sm: "h-10 text-sm",
    md: "h-12 text-sm",
    lg: "h-14 text-base",
  };

  return (
    <div className="relative w-full flex flex-col gap-1.5 min-w-0">
      {label && (
        <label htmlFor={id || name} className="text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative w-full min-w-0">
        <select
          id={id || name}
          value={value}
          onChange={onChange}
          name={name}
          className={`${base} ${stateClasses} ${sizes[size]} ${className}`}
        >
          <option value="">{placeholder || "Select…"}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}

export default Select;
