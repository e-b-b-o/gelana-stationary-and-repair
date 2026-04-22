import { NavLink } from "react-router-dom";

function Button({ children, onClick, variant, size, to }) {
  const base =
    "inline-flex items-center justify-center font-md transition-colors duration-300 ";

  const variants = {
    primary: "bg-primary text-white hover:opacity-80",
    outline:
      "bodrer-primary text-primary  border  hover:bg-primary hover:text-white border-2 hover:border-primary",
    ghost: "text-primary hover:bg-gray-100",
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  if (to)
    return (
      <NavLink
        to={to}
        className={`${base} ${variants[variant]} ${sizes[size]}`}
      >
        {children}
      </NavLink>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

export default Button;
