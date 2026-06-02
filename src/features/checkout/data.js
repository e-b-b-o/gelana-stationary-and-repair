/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Ethiopia",
  "Germany",
  "France",
  "India",
];

export const CITIES_BY_COUNTRY = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds"],
  Canada: ["Toronto", "Vancouver", "Montreal"],
  Australia: ["Sydney", "Melbourne", "Brisbane"],
  Ethiopia: ["Addis Ababa", "Dire Dawa", "Hawassa", "Adama"],
  Germany: ["Berlin", "Hamburg", "Munich"],
  France: ["Paris", "Marseille", "Lyon"],
  India: ["Mumbai", "Delhi", "Bangalore"],
};

export const PHONE_CODES = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+1", flag: "🇨🇦", label: "CA" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+251", flag: "🇪🇹", label: "ET" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
];

export const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard Delivery",
    desc: "5–7 business days",
    price: "Free",
    priceNum: 0,
  },
  {
    id: "express",
    label: "Express Delivery",
    desc: "2–3 business days",
    price: "$9.99",
    priceNum: 9.99,
  },
  {
    id: "overnight",
    label: "Overnight Delivery",
    desc: "Next business day",
    price: "$24.99",
    priceNum: 24.99,
  },
];
