export const formatBalance = (amount: number): string => {
  if (amount >= 1e6) {
    return (amount / 1e6).toFixed(1) + 'M'; // For millions
  } else if (amount >= 1e3) {
    return (amount / 1e3).toFixed(1) + 'K'; // For thousands
  }
  return amount?.toString(); // For amounts less than 1,000
};