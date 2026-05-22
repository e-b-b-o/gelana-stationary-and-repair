import { NavLink } from "react-router-dom";

function Button({
  children,
  onClick,
  variant,
  size,
  to,
  className,
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center  font-md transition-colors duration-300";

  const variants = {
    primary: "bg-primary text-white hover:opacity-80 border-primary border-2",
    outline:
      "border-primary text-primary  border-2  hover:bg-primary hover:text-white  hover:border-primary ",
    ghost: "text-primary hover:bg-gray-100",
    outlineHero:
      "border border-white text-white backdrop-blur-sm bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.12)] hover:bg-white hover:text-primary border-2",
    minimal: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
  };
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  if (to)
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </NavLink>
    );

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
