export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads")) {
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${imagePath}`;
  }
  return imagePath;
};
