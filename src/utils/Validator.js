/* ══════════════════════════════════════════
   VALIDATORS
══════════════════════════════════════════ */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[\d\s\-()+]{7,15}$/.test(v);
const isCard = (v) => /^\d{16}$/.test(v.replace(/\s/g, ""));
const isExpiry = (v) => {
  const c = v.replace(/\s/g, "");
  if (!/^\d{2}\/\d{2}$/.test(c)) return false;
  const [m] = c.split("/").map(Number);
  return m >= 1 && m <= 12;
};
const isCVV = (v) => /^\d{3,4}$/.test(v);

export const validateContact = (f) => {
  const e = {};
  if (!f.firstName.trim()) e.firstName = "First name is required";
  if (!f.lastName.trim()) e.lastName = "Last name is required";
  if (!f.phone.trim() || !isPhone(f.phone))
    e.phone = "Enter a valid phone number";
  if (!f.email.trim() || !isEmail(f.email)) e.email = "Enter a valid email";
  return e;
};

export const validateDelivery = (f) => {
  const e = {};
  if (!f.country) e.country = "Select a country";
  if (!f.city) e.city = "Select a city";
  if (!f.address.trim()) e.address = "Enter your street address";
  if (!f.deliveryMethod) e.deliveryMethod = "Choose a delivery method";
  return e;
};

export const validatePayment = (f) => {
  const e = {};
  if (!f.cardName.trim()) e.cardName = "Cardholder name required";
  if (!isCard(f.cardNumber))
    e.cardNumber = "Enter a valid 16-digit card number";
  if (!isExpiry(f.expiry)) e.expiry = "Invalid date (MM/YY)";
  if (!isCVV(f.cvv)) e.cvv = "Invalid CVV (3–4 digits)";
  return e;
};
