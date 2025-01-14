export const formatTime = (timestamp: any) => {
  const date = new Date(timestamp);

  // Add 3 hours for Kenyan time (UTC+3)
  const kenyanTime = new Date(date.getTime() + 3 * 60 * 60 * 1000);

  // Extract hours, minutes, and seconds in 12-hour format
  let hours = kenyanTime.getHours();
  const minutes = String(kenyanTime.getMinutes()).padStart(2, "0");
  const seconds = String(kenyanTime.getSeconds()).padStart(2, "0");

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12; // If hours is 0, set it to 12 (midnight)

  // Return the time in the format "hh:mm:ss AM/PM"
  return `${hours}:${minutes} ${period}`;
};
