export const formatPrice = (price: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KSH",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
