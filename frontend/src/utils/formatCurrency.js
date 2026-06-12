export function formatCurrency(amount) {
  if (typeof amount !== "number") return "";

  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(amount);
}
